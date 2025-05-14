
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/lib/interfaces/types';
import { useToast } from '@/components/ui/use-toast';
import { useProctoring } from './hooks/useProctoring';
import ProctoringMonitor from './proctoring/ProctoringMonitor';
import QuestionNavigation from './questions/QuestionNavigation';
import { useAppContext } from '@/lib/context';
import AssignmentTabs from './tabs/AssignmentTabs';
import AssignmentResults from './results/AssignmentResults';
import ViolationWarning from './warnings/ViolationWarning';
import { generateYouTubeRecommendations } from './utils/recommendationUtils';

interface TakeAssignmentProps {
  assignment: Assignment;
  onComplete: () => void;
}

const TakeAssignment = ({ assignment, onComplete }: TakeAssignmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [performance, setPerformance] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('questions');
  const [youtubeRecommendations, setYoutubeRecommendations] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, submitAssignment } = useAppContext();
  
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

  // Automatically submit when assignment is locked
  useEffect(() => {
    if (assignmentLocked && !submitted) {
      handleSubmit(true);
    }
  }, [assignmentLocked]);

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

  const handleSubmit = (autoSubmitted: boolean = false) => {
    if (!user) return;
    
    // Skip file validation if it's auto-submitted due to violations
    if (!autoSubmitted && !file) {
      toast({
        title: "You can proceed without uploading",
        description: "Your answers will be submitted directly",
        variant: "default"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would upload the file to storage and get a URL
    // For now, we'll just simulate a file URL
    const mockFileUrl = file ? 
      `assignment_${assignment.id}_${user.id}_${file.name}` : 
      `assignment_${assignment.id}_${user.id}_auto_submitted`;
    
    setTimeout(() => {
      try {
        // Convert answers to text file for faculty (simulated here)
        const answersText = Object.entries(answers).map(([questionId, answer]) => {
          const question = assignment.questions.find(q => q.id === questionId);
          return `Question: ${question?.text || questionId}\nAnswer: ${answer || "No answer provided"}`;
        }).join('\n\n');
        
        console.log(`Answers saved as text file for ${user.name} (${user.id}):\n${answersText}`);
        
        // Use NLP to analyze answers and provide recommendations (simulated)
        console.log("Performing NLP analysis on student answers...");
        
        // Submit and get recommendations
        const results = submitAssignment(assignment.id, user.id, answers, mockFileUrl);
        setPerformance(results);
        
        // Generate YouTube recommendations based on performance
        const recommendations = generateYouTubeRecommendations(results);
        setYoutubeRecommendations(recommendations);
        
        toast({
          title: autoSubmitted ? "Assignment Auto-Submitted" : "Assignment Submitted",
          description: `Your score: ${results.score}/${assignment.questions.length}. Check your recommendations!`,
          variant: autoSubmitted ? "destructive" : "default"
        });
        
        setSubmitted(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit assignment",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
        
        // Stop the camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    }, 1500);
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
          <CardFooter className="flex justify-between">
            {activeTab === 'questions' ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handlePrevQuestion} 
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex === assignment.questions.length - 1 ? (
                  <Button 
                    onClick={() => handleSubmit(false)} 
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
              </>
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
        
        {activeTab === 'questions' && (
          <QuestionNavigation 
            questions={assignment.questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onSelectQuestion={setCurrentQuestionIndex}
          />
        )}
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
