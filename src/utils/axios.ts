import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your base URL for the API
});

// Add a request interceptor to include the access token in the headers
api.interceptors.request.use(async (config) => {
  // Get the current session to retrieve the access token
  const session = await getSession();
 
  if (session?.user?.access) {
    // Set Authorization header with the access token
    config.headers.Authorization = `Bearer ${session?.user?.access}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors (including token expiration and refreshing)
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return the response data
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Fetch the session to get the refresh token or update tokens
        const session = await getSession();
        const refreshToken = session?.user?.refresh;
        

        // Make a call to your refresh token endpoint
        const { data } = await axios.post('/api/job_seeker/validate-token/', { refreshToken });

        const { accessToken: newAccessToken } = data;

        // Update the Axios instance with the new access token
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Sign the user out if refreshing the token fails
        signOut({ callbackUrl: '/signin' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response || error);
  }
);

export default api;
