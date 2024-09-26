import api from "@/utils/axios";




// Function to edit job seeker
export const editJobSeeker = async (params: any,id:any) => {
 
  try {
    const response = await api.put(`/job_seeker/update/${id}/`,params);
    return response;
  } catch (error) {
    console.error("Error edit job seeker info:", error);
    throw error;
  }
};

export const editJobSeekerProfile = async (params: any) => {
 console.log("API DATA",params)
  try {
    const response = await api.put(`/job_seeker/profile-picture/update/`,params);
    return response;
  } catch (error) {
    console.error("Error edit job seeker profile:", error);
    throw error;
  }
};



