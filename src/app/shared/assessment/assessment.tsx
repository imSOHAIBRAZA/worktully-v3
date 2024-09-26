"use client"
import React, { useState, useEffect } from 'react';
import useFullscreen from '@/hooks/use-full-screen';
import { useParams } from 'next/navigation';
import { Button, Text, Title, Progressbar } from "rizzui";
import CountdownTimer from '@/app/shared/assessment/countdown-timer';
import { useAtom } from 'jotai';
import { AssessmentAtom } from "@/store/AssessmentAtom";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import AssessmentHeader from './assessment-header';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssessmentQuestions, submitAssessment } from '@/actions/assessment';
import toast from 'react-hot-toast';
import ResultModal from './modal/result-modal';
import QuizContainer from './quiz-container';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const Assessment = ({ data = {} }) => {
    const { screening_test_duration = 1200000, questions: quiz = [] } = data
    const searchParams = useSearchParams();
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timer, setTimer] = useState(screening_test_duration); // 20 minutes in seconds
    const [testResult, setTestResult] = useState([]);
    // const [questions] = useState(quiz)
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
    const [isLoading, setIsLoading] = useState(false);

    const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // State for modal control and result data
    const [isModalOpen, setModalOpen] = useState(false);
    const [resultData, setResultData] = useState(null); // Store the result data




    const handleOnClose = () => {
        setModalOpen(false)
        router.push('/profile');
    };
    // Use the custom fullscreen hook
    const { toggleFullscreen, exitFullscreen } = useFullscreen();

    //** GET QUESTIONS **//
    // const { data, isLoading: isQuestionLoading } = useQuery({
    //     queryKey: ["getAssessment", searchParams.get("jobTitleId")], // Adding params.id as part of query key
    //     queryFn: () => getAssessmentQuestions({ job_title_id: searchParams.get("jobTitleId") }), // Passing the id as a parameter
    //     enabled: !!searchParams.get("jobTitleId")// Only run query if params.id exists
    // });
    // const questions = data?.data?.questions || [];

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
                job_profile_id: searchParams.get("jobProfileId"),
                job_title_id: searchParams.get("jobTitleId"),
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
        <div className="min-h-screen min-w-full  flex flex-col justify-between p-10">

            <div>
                {/* HEADER */}
                <AssessmentHeader />

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

                    {questions && questions.length > 0 && (
                        <CountdownTimer
                            duration={timer}
                            quizCompleted={quizCompleted}
                            onComplete={handleSubmit}
                        />
                    )}
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
                {/* <QuizContainer /> */}

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
                    <span>Previous</span>

                </Button>

                <Button
                    onClick={currentQuestion < questions.length - 1 ? moveToNextQuestion : handleSubmit}
                    disabled={!selectedAnswers[currentQuestion] || quizCompleted}
                    isLoading={isAdding}
                    rounded="pill"
                >
                    {currentQuestion < questions.length - 1 ? 'Next' : 'Submit'}
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
                    onClose={handleOnClose}
                    status={resultData?.status}
                    result={resultData}
                />
            )}

        </div>
    );
};

export default Assessment;

