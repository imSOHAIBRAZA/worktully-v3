import api from "@/utils/axios";




// Function to add and edit skill
export const addSkill = async (params: any) => {
  const {id,...data}= params 
  try {
    const response = await api.put(`/job_profile/update_skills/`,data);
    return response;
  } catch (error) {
    console.error("Error edit skill:", error);
    throw error;
  }
};


