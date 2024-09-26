"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Text, Title, Progressbar } from "rizzui";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import CountdownTimer from '@/app/shared/assessment/countdown-timer';
import { siteConfig } from '@/config/site.config';
import { IoSaveOutline } from "react-icons/io5";
import { useAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssessmentQuestions, submitAssessment } from '@/actions/assessment';
import { AssessmentAtom } from "@/store/AssessmentAtom";
import toast from 'react-hot-toast';
import Card from '@/components/cards/card';
import { Modal } from "rizzui";
import ResultModal from '../shared/assessment/modal/result-modal';

const AssessmentPage = () => {

    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timer, setTimer] = useState(1800); // 20 minutes in seconds
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
    const timerRef = useRef(timer); // Create a ref to store the timer value
    const [assessmentData] = useAtom(AssessmentAtom);

    // State for modal control and result data
const [isModalOpen, setModalOpen] = useState(false);
const [resultData, setResultData] = useState(null); // Store the result data

    // Destructure the data
    const { jobProfileId, jobTitleId } = assessmentData;

    // const { data, isLoading: isQuestionLoading } = useQuery({
    //     queryKey: ["getAssessment", jobTitleId], // Adding params.id as part of query key
    //     queryFn: () => getAssessmentQuestions({ job_title_id: jobTitleId }), // Passing the id as a parameter
    //     enabled: !!jobTitleId // Only run query if params.id exists
    // });
    // const questions = data?.data?.questions || [];



    // Function to request fullscreen
    const requestFullscreen = async () => {
        const el = document.documentElement; // Target the document for fullscreen
        try {
            if (el.requestFullscreen) {
                await el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) { // For Safari
                await el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) { // For IE11
                await el.msRequestFullscreen();
            }
            setIsFullscreen(true); // Set state to true when in fullscreen
        } catch (error) {
            console.error("Failed to enter fullscreen:", error);
        }
    };

    // Function to exit fullscreen
    const exitFullscreen = async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { // For Safari
                await document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // For IE11
                await document.msExitFullscreen();
            }
            setIsFullscreen(false); // Set state to false when out of fullscreen
        } catch (error) {
            console.error("Failed to exit fullscreen:", error);
        }
    };

    // Use effect to request fullscreen on component mount
    useEffect(() => {
        requestFullscreen(); // Request fullscreen when the component mounts

        // Cleanup function to exit fullscreen when the component unmounts
        return () => {
            if (isFullscreen) {
                exitFullscreen();
            }
        };
    }, [isFullscreen]);

    // Function to handle "Exit" button click
    const handleExit = () => {
        router.push('/profile'); // Redirect to the /profile page
    };

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

    const moveToPreviousQuestion = () => {
        if (currentQuestion > 0) {
            const questionId = questions[currentQuestion].id;
            const updatedTestResult = [...testResult];

            // Update the answer for the current question before moving back
            updatedTestResult[currentQuestion] = {
                question_id: questionId,
                selected_option: selectedAnswers[currentQuestion]
            };

            // Save the updated test result to localStorage
            localStorage.setItem('testResult', JSON.stringify(updatedTestResult));
            setTestResult(updatedTestResult);

            // Move to the previous question
            setCurrentQuestion(currentQuestion - 1);
        }
    };


    return (
        <div className="min-h-screen min-w-full  flex flex-col justify-between p-10">

            <div>
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <Image
                        width={260}
                        height={260}
                        src={siteConfig.logo}
                        alt={siteConfig.title}
                        className="dark:invert"
                        priority
                    />

                    <Button
                        className="text-primary border border-primary"
                        variant="outline" color="primary" rounded="pill"
                        onClick={handleExit}>
                        <IoSaveOutline
                            className="h-4 w-4 mr-2" />
                        <span> Save and Exit</span>{" "}
                    </Button>

                </div>

                {/* PROGRESS BAR AND TIMER */}
                <div className="flex justify-between my-4">
                    <div>
                        <Text className="capitalize text-sm text-gray-500">
                            AI ASSESSMENT
                        </Text>
                        <Title
                            as="h2"
                            className="capitalize text-xl font-bold text-gray-900"
                        >
                            Software Engineer
                        </Title>
                    </div>

                    <CountdownTimer />
                </div>

                <Progressbar
                    value={quizCompleted ? 100 : (currentQuestion / questions?.length) * 100}
                    className="gap-0"
                />
                <Text className="mt-2 text-primary font-bold text-right">
                    {currentQuestion + 1}/{questions?.length}
                </Text>

                {/* TEST QUESTION */}
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

            </div>
            {/* FOOTER ACTION BUTTONS  */}
            <div className="flex justify-between mt-4">
                <Button
                    onClick={moveToPreviousQuestion}
                    variant="outline"
                    rounded="pill"
                    className='text-primary border-primary'
                    disabled={currentQuestion === 0} // Disable if at the first question
                >
                    <ArrowLeftIcon
                        strokeWidth="2"
                        color="primary"
                        className="h-4 w-4 mr-2"
                    />
                    <span>Previous</span>{" "}

                </Button>

                <Button
                    onClick={currentQuestion < questions.length - 1 ? moveToNextQuestion : handleSubmit}
                    disabled={selectedAnswers[currentQuestion] === null}
                    rounded="pill"
                >
                    <span>{isLoading ? (
                        <div className="w-10 h-10">
                            Loading ...
                        </div>
                    ) : currentQuestion < questions.length - 1 ? (
                        'Next'
                    ) : (
                        'Complete'
                    )}</span>{" "}
                    <ArrowRightIcon
                        strokeWidth="2"
                        color="primary"
                        className="h-4 w-4 ml-2"
                    />
                </Button>
            </div>

            {isModalOpen && resultData && (
            <ResultModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                status={resultData?.status}
                result = {resultData}
            />
        )}

        </div>
    );
};

export default AssessmentPage;
