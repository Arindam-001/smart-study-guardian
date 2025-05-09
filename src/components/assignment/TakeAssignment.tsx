
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { useProctoring } from './hooks/useProctoring';
import ProctoringMonitor from './proctoring/ProctoringMonitor';
import QuestionDisplay from './questions/QuestionDisplay';
import QuestionNavigation from './questions/QuestionNavigation';

interface TakeAssignmentProps {
  assignment: Assignment;
  onComplete: () => void;
}

const TakeAssignment = ({ assignment, onComplete }: TakeAssignmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    videoRef,
    streamRef,
    hasWarning,
    movementCount
  } = useProctoring(assignment.id);

  const currentQuestion = assignment.questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
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

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Assignment Submitted",
        description: "Your answers have been submitted successfully."
      });
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      onComplete();
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-3/4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-edu-primary">
              {assignment.title} - Question {currentQuestionIndex + 1} of {assignment.questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionDisplay 
              question={currentQuestion}
              answer={answers[currentQuestion.id] || ''}
              onAnswerChange={handleAnswerChange}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevQuestion} 
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === assignment.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                className="bg-edu-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </Button>
            ) : (
              <Button 
                variant="default" 
                onClick={handleNextQuestion} 
                className="bg-edu-primary"
              >
                Next
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <QuestionNavigation 
          questions={assignment.questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onSelectQuestion={setCurrentQuestionIndex}
        />
      </div>

      <div className="w-full lg:w-1/4">
        <ProctoringMonitor 
          videoRef={videoRef}
          movementCount={movementCount}
          hasWarning={hasWarning}
        />
      </div>
    </div>
  );
};

export default TakeAssignment;
