
import api from "@/utils/axios";

// Function to add Job profile
export const addJobProfile = async (params: any) => {
  try {
    const response = await api.post("/job_profile/add/", params);
    return response;
  } catch (error) {
    console.error("Error adding job profile:", error);
    throw error;
  }
};


// Function to update job profile
export const editJobProfile = async (params: any,id:any) => {
  // const {id,...data}= params 
  try {
    const response = await api.put(`/job_profile/update/${id}/`,params);
    return response;
  } catch (error) {
    console.error("Error edit job profile:", error);
    throw error;
  }
};