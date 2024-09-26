import api from "@/utils/axios";

// Function to add education
export const addEducation = async (params: any) => {
  try {
    const response = await api.post("/education/add/", params);
    return response;
  } catch (error) {
    console.error("Error adding education:", error);
    throw error;
  }
};

// Function to delete education
export const deleteEducation = async (id: any) => {
  try {
    const response = await api.delete(`/education/delete/${id}/`);
    return response;
  } catch (error) {
    console.error("Error delete education:", error);
    throw error;
  }
};


// Function to delete education
export const editEducation = async (params: any) => {
  const {id,...data}= params 
  try {
    const response = await api.put(`/education/update/${id}/`,data);
    return response;
  } catch (error) {
    console.error("Error edit education:", error);
    throw error;
  }
};


