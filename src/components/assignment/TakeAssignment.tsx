
import React, { useEffect } from 'react';
import { TakeAssignmentProps } from './interfaces/TakeAssignmentProps';
import { useProctoring } from './hooks/useProctoring';
import { useAssignmentSubmission } from './hooks/useAssignmentSubmission';
import { useAssignmentState } from './hooks/useAssignmentState';
import { useAppContext } from '@/lib/context';
import AssignmentContent from './content/AssignmentContent';
import ProctoringContainer from './proctoring/ProctoringContainer';
import AssignmentResults from './results/AssignmentResults';

const TakeAssignment = ({ assignment, onComplete }: TakeAssignmentProps) => {
  const { user } = useAppContext();
  
  // Skip authentication check - allow direct access to assignments
  
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    file,
    activeTab,
    setActiveTab,
    fileInputRef,
    currentQuestion,
    handleAnswerChange,
    handleFileChange,
    handleNextQuestion,
    handlePrevQuestion
  } = useAssignmentState(assignment);

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
      // After successful submission, just call onComplete
      if (onComplete) {
        onComplete();
      }
    }
  });

  // Automatically submit when assignment is locked
  useEffect(() => {
    if (assignmentLocked && !submitted) {
      handleSubmit(true);
    }
  }, [assignmentLocked, submitted, handleSubmit]);

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
          currentQuestionIndex={currentQuestionIndex}
          currentQuestion={currentQuestion}
          answers={answers}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleAnswerChange={handleAnswerChange}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleNextQuestion={handleNextQuestion}
          handlePrevQuestion={handlePrevQuestion}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          isSubmitting={isSubmitting}
          onSubmit={(e) => {
            if (e) {
              e.preventDefault(); // Prevent form submission from refreshing
            }
            handleSubmit(false);
          }}
        />
      </div>

      <div className="w-full lg:w-1/4">
        <ProctoringContainer
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
