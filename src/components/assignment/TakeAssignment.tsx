
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/lib/interfaces/types';
import { useToast } from '@/hooks/use-toast';
import { useProctoring } from './hooks/useProctoring';
import ProctoringMonitor from './proctoring/ProctoringMonitor';
import QuestionDisplay from './questions/QuestionDisplay';
import QuestionNavigation from './questions/QuestionNavigation';
import { useAppContext } from '@/lib/context';
import StudentPerformanceCard from '@/components/student/StudentPerformanceCard';
import RecommendationsCard from '@/components/student/RecommendationsCard';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, submitAssignment } = useAppContext();
  
  const {
    videoRef,
    streamRef,
    hasWarning,
    movementCount,
    tabSwitchCount,
    assignmentLocked,
  } = useProctoring(assignment.id);

  // Automatically submit when assignment is locked
  useEffect(() => {
    if (assignmentLocked && !submitted) {
      handleSubmit(true);
    }
  }, [assignmentLocked]);

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
        
        // Submit and get recommendations
        const results = submitAssignment(assignment.id, user.id, answers, mockFileUrl);
        setPerformance(results);
        
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

  // When the user views their results and recommendations
  const handleFinish = () => {
    onComplete();
  };

  if (submitted && performance) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-edu-primary text-xl">
              Assignment Results: {assignment.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <StudentPerformanceCard performance={performance} />
            
            <div className="my-6">
              <h3 className="text-lg font-medium mb-4">Personalized Recommendations</h3>
              <RecommendationsCard resources={performance.recommendedResources} />
            </div>
            
            <div className="text-center">
              <Button onClick={handleFinish} className="px-8">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            
            {currentQuestionIndex === assignment.questions.length - 1 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium mb-2">Upload Assignment Document (Optional)</h4>
                <div className="flex flex-col space-y-2">
                  <Input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx" 
                  />
                  <p className="text-xs text-muted-foreground">
                    You can submit without uploading a document. Your answers will be saved automatically.
                  </p>
                </div>
              </div>
            )}
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
          tabSwitchCount={tabSwitchCount}
        />
      </div>
    </div>
  );
};

export default TakeAssignment;
