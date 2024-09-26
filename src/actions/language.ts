import api from "@/utils/axios";

// Function to add Language
export const addLanguage = async (params: any) => {
  try {
    const response = await api.post("/language/add/", params);
    return response;
  } catch (error) {
    console.error("Error adding language:", error);
    throw error;
  }
};

// Function to delete Language
export const deleteLanguage = async (id: any) => {
  try {
    const response = await api.delete(`/language/delete/${id}/`);
    return response;
  } catch (error) {
    console.error("Error delete language:", error);
    throw error;
  }
};

// Function to update Language
export const editLanguage = async (params: any) => {
  const {id,...data}= params 
  try {
    const response = await api.put(`/language/update/${id}/`,data);
    return response;
  } catch (error) {
    console.error("Error edit language:", error);
    throw error;
  }
};




