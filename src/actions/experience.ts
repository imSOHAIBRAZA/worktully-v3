import api from "@/utils/axios";

// Function to add Experience
export const addExperience = async (params: any) => {
  try {
    const response = await api.post("/experience/add/", params);
    return response;
  } catch (error) {
    console.error("Error adding experience:", error);
    throw error;
  }
};

// Function to delete Experience
export const deleteExperience = async (id: any) => {
  try {
    const response = await api.delete(`/experience/delete/${id}/`);
    return response;
  } catch (error) {
    console.error("Error delete experience:", error);
    throw error;
  }
};

// Function to update Experience
export const editExperience = async (params: any) => {
  const {id,...data}= params 
  try {
    const response = await api.put(`/experience/update/${id}/`,data);
    return response;
  } catch (error) {
    console.error("Error edit experience:", error);
    throw error;
  }
};
