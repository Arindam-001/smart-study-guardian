
import React, { useState, useRef, useEffect } from 'react';
import { Assignment } from '@/lib/interfaces/types';
import { useProctoring } from './hooks/useProctoring';
import { useSessionUser } from './hooks/useSessionUser';
import { useAssignmentSubmission } from './hooks/useAssignmentSubmission';
import AssignmentContent from './main/AssignmentContent';
import AssignmentSidebar from './main/AssignmentSidebar';
import AssignmentResults from './results/AssignmentResults';

interface TakeAssignmentProps {
  assignment: Assignment;
  onComplete: () => void;
}

const TakeAssignment = ({ assignment, onComplete }: TakeAssignmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('questions');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use the session user hook
  const { user } = useSessionUser();
  
  // Use proctoring hook
  const {
    videoRef,
    streamRef,
    hasWarning,
    movementCount,
    deviceDetected,
    tabSwitchCount,
    assignmentLocked,
    createWarning
  } = useProctoring(assignment.id);

  // Use submission hook
  const {
    isSubmitting,
    submitted,
    performance,
    youtubeRecommendations,
    handleSubmit
  } = useAssignmentSubmission({
    assignment,
    answers,
    file,
    streamRef,
    createWarning,
    onSubmitComplete: () => {
      // After successful submission, close the window or redirect
      if (window.opener && !window.opener.closed) {
        // Notify the opener window that submission is complete
        window.opener.postMessage({ 
          type: 'ASSIGNMENT_SUBMITTED',
          assignmentId: assignment.id
        }, '*');
        
        // Close this window after a short delay
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        // If can't close, just call onComplete
        onComplete();
      }
    }
  });

  // Automatically submit when assignment is locked
  useEffect(() => {
    if (assignmentLocked && !submitted) {
      handleSubmit(true);
    }
  }, [assignmentLocked, submitted]);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        createWarning("Tab switching detected");
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [createWarning]);

  const currentQuestion = assignment.questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // When submitted, show results
  if (submitted && performance) {
    return (
      <AssignmentResults
        assignment={assignment}
        performance={performance}
        youtubeRecommendations={youtubeRecommendations}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-3/4">
        <AssignmentContent 
          assignment={assignment}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          handleAnswerChange={handleAnswerChange}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleNextQuestion={handleNextQuestion}
          handlePrevQuestion={handlePrevQuestion}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="w-full lg:w-1/4">
        <AssignmentSidebar 
          videoRef={videoRef}
          movementCount={movementCount}
          hasWarning={hasWarning}
          tabSwitchCount={tabSwitchCount}
          deviceDetected={deviceDetected}
        />
      </div>
    </div>
  );
};

export default TakeAssignment;
