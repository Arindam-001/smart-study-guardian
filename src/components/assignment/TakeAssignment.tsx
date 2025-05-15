
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/lib/interfaces/types';
import { useProctoring } from './hooks/useProctoring';
import ProctoringMonitor from './proctoring/ProctoringMonitor';
import { useAppContext } from '@/lib/context';
import AssignmentTabs from './tabs/AssignmentTabs';
import AssignmentResults from './results/AssignmentResults';
import ViolationWarning from './warnings/ViolationWarning';
import { useAssignmentSubmission } from './hooks/useAssignmentSubmission';
import QuestionSection from './questions/QuestionSection';

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
  const { user, setUser } = useAppContext();
  
  // Skip authentication check - allow direct access to assignments
  
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
      onComplete();
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
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-edu-primary">
              {assignment.title}
              {activeTab === 'questions' && (
                <span className="ml-2">
                  - Question {currentQuestionIndex + 1} of {assignment.questions.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssignmentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentQuestion={currentQuestion}
              currentAnswer={answers[currentQuestion.id] || ''}
              onAnswerChange={handleAnswerChange}
              isLastQuestion={currentQuestionIndex === assignment.questions.length - 1}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
            />
          </CardContent>
          <CardFooter>
            {activeTab === 'questions' ? (
              <QuestionSection 
                questions={assignment.questions}
                currentQuestionIndex={currentQuestionIndex}
                currentQuestion={currentQuestion}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onNextQuestion={handleNextQuestion}
                onPrevQuestion={handlePrevQuestion}
                onSelectQuestion={setCurrentQuestionIndex}
                isSubmitting={isSubmitting}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onSubmit={() => handleSubmit(false)}
              />
            ) : (
              <div className="w-full flex justify-end">
                <Button 
                  onClick={() => setActiveTab('questions')} 
                  variant="outline"
                >
                  Back to Questions
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="w-full lg:w-1/4">
        <ProctoringMonitor 
          videoRef={videoRef}
          movementCount={movementCount}
          hasWarning={hasWarning}
          tabSwitchCount={tabSwitchCount}
          deviceDetected={deviceDetected}
        />
        
        <ViolationWarning count={tabSwitchCount} />
      </div>
    </div>
  );
};

export default TakeAssignment;
