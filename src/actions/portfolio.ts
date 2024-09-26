import api from "@/utils/axios";

// Function to add Portfolio
export const addPortfolio = async (params: any) => {
  try {
    const response = await api.post("/job_profile/portfolio/add/", params);
    return response;
  } catch (error) {
    console.error("Error adding Portfolio:", error);
    throw error;
  }
};

// Function to delete Portfolio
export const deletePortfolio = async (id: any) => {
  try {
    const response = await api.delete(`/job_profile/portfolio/delete/${id}/`);
    return response;
  } catch (error) {
    console.error("Error delete Portfolio:", error);
    throw error;
  }
};

// Function to update Portfolio
export const editPortfolio = async (params: any) => {
  const {id,...data}= params 
  try {
    const response = await api.put(`/job_profile/portfolio/update/${id}/`,data);
    return response;
  } catch (error) {
    console.error("Error edit Portfolio:", error);
    throw error;
  }
};




