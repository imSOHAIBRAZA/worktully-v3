// import React, { useState } from 'react';
// import { getAssessmentQuestions, submitAssessment } from '@/actions/assessment';
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Quiz from './quiz'; // Adjust import according to your structure

// const QuizContainer = ({ questions }) => {
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [selectedAnswers, setSelectedAnswers] = useState(new Array(questions.length).fill(null));
//     const [testResult, setTestResult] = useState([]);

//     const moveToPreviousQuestion = () => {
//         setCurrentQuestion((prev) => Math.max(prev - 1, 0));
//     };

//     const moveToNextQuestion = () => {
//         setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
//     };

//        //**  SUBMIT ASSESSMENT  **//
//     //    const { mutate: handleSubmit, isPending: isAdding } = useMutation({
//     //     mutationFn: async () => {
//     //         let finalTestResult = testResult;
//     //         setQuizCompleted(true); // Mark the quiz as completed

//     //         // If the current testResult is incomplete, add the current question and answer
//     //         if (testResult.length < questions.length) {
//     //             finalTestResult = [
//     //                 ...testResult,
//     //                 {
//     //                     question_id: questions[currentQuestion].id,
//     //                     selected_option: selectedAnswers[currentQuestion],
//     //                 },
//     //             ];
//     //         }

//     //         // Fetch any previously stored test results if available
//     //         const storedTestResult = JSON.parse(localStorage.getItem('testResult'));

//     //         const requestData = {
//     //             job_profile_id: jobProfileId,
//     //             job_title_id: jobTitleId,
//     //             submission:
//     //                 finalTestResult.length > 0
//     //                     ? finalTestResult
//     //                     : storedTestResult
//     //                         ? storedTestResult
//     //                         : [],
//     //         };

//     //         return await submitAssessment(requestData);
//     //     },


//     //     onSuccess: (response: any, variables: any) => {
//     //         // toast.success(response?.message);

//     //         if (response) {
//     //             // Open modal with the result data
//     //             setModalOpen(true);
//     //             setResultData({
//     //                 status: response.status,
//     //                 obtainedMarks: response.obtained_marks,
//     //                 totalMarks: response.total_marks,
//     //             });
//     //         }
//     //     },
//     //     onError: (error, variables, context) => {
//     //         if (error) {
//     //             toast.error(`${error?.data?.detail}`);
//     //         }
//     //     },
//     // });

//     const handleSubmit =(val)=>{
//         console.log("RESULT",val)
//     }

//     return (
        
//         <Quiz
//             questions={questions}
//             currentQuestion={currentQuestion}
//             selectedAnswers={selectedAnswers}
//             setSelectedAnswers={setSelectedAnswers} // Pass the state updater function
//             moveToPreviousQuestion={moveToPreviousQuestion}
//             moveToNextQuestion={moveToNextQuestion}
//             handleSubmit={handleSubmit}
//         />
//     );
// };


// export default QuizContainer;

"use client"
import React, { useState, useEffect, useRef } from 'react';
import useFullscreen from '@/hooks/use-full-screen';
import { useParams } from 'next/navigation';
import { Button, Text, Title, Progressbar } from "rizzui";
import CountdownTimer from '@/app/shared/assessment/countdown-timer';
import { useAtom } from 'jotai';
import { AssessmentAtom } from "@/store/AssessmentAtom";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Card from '@/components/cards/card';
import { Modal } from "rizzui";
import AssessmentHeader from './assessment-header';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssessmentQuestions, submitAssessment } from '@/actions/assessment';
import toast from 'react-hot-toast';
import ResultModal from './modal/result-modal';
// import QuizContainer from './quiz-container';

const QuizContainer = () => {
    const params = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timer, setTimer] = useState(1200000); // 20 minutes in seconds
    const [testResult, setTestResult] = useState([]);
    const [questions, setQuestions] = useState([
        {
            "id": 354,
            "question": "When working on a team project, what is the most important factor for successful collaboration?",
            "options": [
                "Individual coding speed",
                "Working independently on separate features",
                "Clear communication and shared understanding",
                "Using the same code editor"
            ]
        },

        {
            "id": 366,
            "question": "How do you contribute to a positive and productive team environment?",
            "options": [
                "Being critical of others' work",
                "Working independently and avoiding collaboration",
                "Being supportive and helpful to your team members",
                "Focusing only on your own tasks"
            ]
        },
        {
            "id": 367,
            "question": "What is the difference between `SELECT` and `SELECT DISTINCT` in MySQL?",
            "options": [
                "`SELECT` retrieves all rows, while `SELECT DISTINCT` retrieves only unique rows",
                "They have the same functionality",
                " `SELECT` retrieves only unique rows, while `SELECT DISTINCT` retrieves all rows",
                " `SELECT` retrieves specific columns, while `SELECT DISTINCT` retrieves all columns"
            ]
        },
        {
            "id": 368,
            "question": "How do you handle situations where a team member is not contributing effectively?",
            "options": [
                "Ignoring the situation",
                "Confronting the team member directly",
                "Bringing the issue to the team lead",
                "Blaming the team member"
            ]
        },
        {
            "id": 369,
            "question": "What is the `ALTER TABLE` statement used for in MySQL?",
            "options": [
                "Creating a new table",
                "Deleting a table",
                "Modifying the structure of an existing table",
                "Inserting data into a table"
            ]
        },
    ]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showBackModal, setShowBackModal] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    // const timerRef = useRef(timer); 
    const [assessmentData] = useAtom(AssessmentAtom);


    // Destructure the data
    const { jobProfileId, jobTitleId } = assessmentData;

        // State for modal control and result data
const [isModalOpen, setModalOpen] = useState(false);
const [resultData, setResultData] = useState(null); // Store the result data

    // Use the custom fullscreen hook
    const {  toggleFullscreen,exitFullscreen } = useFullscreen();

  
    // Use effect to request fullscreen on component mount
    useEffect(() => {
        toggleFullscreen();

        return () => {
            exitFullscreen(); 
        };
    }, []); 


 

    const handleAnswerSelect = (answer: any) => {
        const updatedSelectedAnswers = [...selectedAnswers];
        updatedSelectedAnswers[currentQuestion] = answer;
        setSelectedAnswers(updatedSelectedAnswers);
    };

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const moveToNextQuestion = () => {
        if (selectedAnswers[currentQuestion] !== null) {
            const questionId = questions[currentQuestion].id;
            const updatedTestResult = [...testResult, { question_id: questionId, selected_option: selectedAnswers[currentQuestion] }];

            localStorage.setItem('testResult', JSON.stringify(updatedTestResult));
            setTestResult(updatedTestResult);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            }
        }
    };

    const moveToPreviousQuestion = () => {
        if (currentQuestion > 0) {
            const questionId = questions[currentQuestion].id;
            const updatedTestResult = [...testResult];
    
            // Save the current answer before moving back
            updatedTestResult[currentQuestion] = {
                question_id: questionId,
                selected_option: selectedAnswers[currentQuestion] // Keep the current selected answer
            };
    
            // Save the updated test result to localStorage
            localStorage.setItem('testResult', JSON.stringify(updatedTestResult));
            setTestResult(updatedTestResult);
    
            // Move to the previous question
            setCurrentQuestion(currentQuestion - 1);
        }
    };
    


    
    //**  SUBMIT ASSESSMENT  **//
    const { mutate: handleSubmit, isPending: isAdding } = useMutation({
        mutationFn: async () => {
            let finalTestResult = testResult;
            setQuizCompleted(true); // Mark the quiz as completed
            // If the current testResult is incomplete, add the current question and answer
            if (testResult.length < questions.length) {
                finalTestResult = [
                    ...testResult,
                    {
                        question_id: questions[currentQuestion].id,
                        selected_option: selectedAnswers[currentQuestion],
                    },
                ];
            }

            // Fetch any previously stored test results if available
            const storedTestResult = JSON.parse(localStorage.getItem('testResult'));

            const requestData = {
                job_profile_id: jobProfileId,
                job_title_id: jobTitleId,
                submission:
                    finalTestResult.length > 0
                        ? finalTestResult
                        : storedTestResult
                            ? storedTestResult
                            : [],
            };

            return await submitAssessment(requestData);
        },


        onSuccess: (response: any, variables: any) => {
            // toast.success(response?.message);

            if (response) {
                // Open modal with the result data
                setModalOpen(true);
                setResultData({
                    status: response.status,
                    obtainedMarks: response.obtained_marks,
                    totalMarks: response.total_marks,
                });
            }
        },
        onError: (error, variables, context) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    });

    return (
         <div onCopy={handleCopy} className='mt-10'>
                    <h3 className="text-lg font-bold">
                        {currentQuestion + 1}. {questions[currentQuestion]?.question}
                    </h3>

                    <div className="mt-4">
                        {questions[currentQuestion]?.options?.map((option, index) => (
                            <div key={index} className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-primary"
                                        name={`question-${currentQuestion}`}
                                        value={option}
                                        checked={selectedAnswers[currentQuestion] === option}
                                        onChange={() => handleAnswerSelect(option)}
                                    />
                                    <span className="ml-2">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div> 
    );
};

export default QuizContainer;

