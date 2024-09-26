import api from "@/utils/axios";


export const submitAssessment = async (params: any) => {
  try {
    const response = await api.post("/submit_assessment_results/", params);
    return response;
  } catch (error) {
    console.error("Error submit assessment results:", error);
    throw error;
  }
};


// Function to get Assessment Question
export const getAssessmentQuestions= async (data:any) => {
  try {
    const response = await api.post("/get-assessment-questions/",data);
    return response;
  } catch (error) {
    console.error("Error get assessment questions", error);
    throw error;
  }
};