'use client';

import { useState, useEffect } from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';

// Renderer function for countdown
const Render: CountdownRendererFn = ({ minutes, seconds, completed }) => {
  if (completed) {
    return <span>Time's up! Test completed.</span>;
  } else {
    return (
      <div className="flex items-center gap-3 text-center text-base font-medium text-gray-1000 md:text-2xl xl:gap-2 xl:text-3xl 2xl:gap-3 2xl:text-4xl">
        <div className="min-w-[45px]">
          <p>{minutes < 10 ? `0${minutes}` : minutes}</p>
        </div>
        <span className="flex  flex-col items-center justify-center gap-1 md:gap-2 xl:gap-3 ">
          <span className="h-1 w-1 rounded-full bg-primary md:h-1.5 md:w-1.5 xl:h-2 xl:w-2"></span>
          <span className="h-1 w-1 rounded-full bg-primary md:h-1.5 md:w-1.5 xl:h-2 xl:w-2"></span>
        </span>
        <div className="min-w-[45px]">
          <p>{seconds < 10 ? `0${seconds}` : seconds}</p>
        </div>
      </div>
    );
  }
};

export default function CountdownTimer({ duration = 1200000, quizCompleted, onComplete }) {
  // Persist the start time when the test begins
  const [startTime, setStartTime] = useState(() => {
    const savedTime = localStorage?.getItem('quizStartTime');
    return savedTime ? Number(savedTime) : Date.now() + duration;
  });

  // Save the start time in localStorage on mount (to persist across reloads or navigation)
  useEffect(() => {
    if (!localStorage?.getItem('quizStartTime')) {
      localStorage?.setItem('quizStartTime', String(startTime));
    }
  }, [startTime]);

  // Clear the stored start time when the quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      localStorage?.removeItem('quizStartTime');
    }
  }, [quizCompleted]);

  // Handle when the countdown timer completes
  const handleComplete = () => {
    onComplete(); // Automatically submit the test when the timer completes
    localStorage?.removeItem('quizStartTime'); // Clear the timer storage
  };

  // Return null or a message if quiz is completed to stop rendering the timer
  if (quizCompleted) {
    return <span>Quiz Completed!</span>; // You can change this message as needed
  }

  return (
    <div>
      <Countdown
        date={startTime}
        renderer={Render}
        onComplete={handleComplete} // Call handleComplete when time runs out
      />
    </div>
  );
}
