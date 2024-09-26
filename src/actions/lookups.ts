import api from "@/utils/axios";

// Function to get Countries
export const getCountries = async () => {
  try {
    const response = await api.get("/countries/");
    return response;
  } catch (error) {
    console.error("Error get countries:", error);
    throw error;
  }
};


// Function to get Countries
export const getLanguages = async () => {
  try {
    const response = await api.get("/languages/");
    return response;
  } catch (error) {
    console.error("Error get languages", error);
    throw error;
  }
};


// Function to get Job Titles
export const getJobTitles= async () => {
  try {
    const response = await api.get("/jobtitles/");
    return response;
  } catch (error) {
    console.error("Error get languages", error);
    throw error;
  }
};

// Function to get  skill categories
export const getSkillCategories= async () => {
  try {
    const response = await api.get("/skill-categories/");
    return response;
  } catch (error) {
    console.error("Error get skill categories", error);
    throw error;
  }
};



// Function to get Degree Types
export const getDegreeTypes = async () => {
  try {
    const response = await api.get(`/degree-types/`);
    return response;
  } catch (error) {
    console.error("Error get degree types:", error);
    throw error;
  }
};


// Function to get Degree Types
export const getDesignations = async () => {
  try {
    const response = await api.get(`/designations/`);
    return response;
  } catch (error) {
    console.error("Error get degree types:", error);
    throw error;
  }
};




