import React from 'react';
import { Button } from 'rizzui';
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const Quiz=({
    questions,
    currentQuestion,
    selectedAnswers,
    setSelectedAnswers, // Add this to update the selected answers
    handleAnswerSelect,
    moveToPreviousQuestion,
    moveToNextQuestion,
    handleSubmit,
    quizCompleted,
    isAdding,
}) => {
    // This function will handle the answer selection and update the state correctly
    const handleOptionSelect = (option: any) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[currentQuestion] = option; // Update only the current question's answer
        setSelectedAnswers(updatedAnswers); // Update state with the new answers
    };

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div>
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
                                    onChange={() => handleOptionSelect(option)} // Use the new function
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER ACTION BUTTONS */}
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
                    disabled={!selectedAnswers[currentQuestion] || quizCompleted} // Disable if no option is selected
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
        </div>
    );
}

export default React.memo(Quiz);