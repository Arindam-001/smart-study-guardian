
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Assignment, Question, useAppContext } from '@/lib/context';
import { AlertTriangle, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface TakeAssignmentProps {
  assignment: Assignment;
  onComplete: () => void;
}

const TakeAssignment = ({ assignment, onComplete }: TakeAssignmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasWarning, setHasWarning] = useState(false);
  const [movementCount, setMovementCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { user, addWarning } = useAppContext();
  const { toast } = useToast();

  // Start video stream when component mounts
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        createWarning("Camera access denied");
      }
    };
    
    startVideo();
    
    // Simulate movement detection
    const movementInterval = setInterval(() => {
      const shouldDetectMovement = Math.random() > 0.8;
      if (shouldDetectMovement) {
        const movement = Math.floor(Math.random() * 10);
        setMovementCount(prev => prev + movement);
        if (movement > 5) {
          createWarning("Excessive movement detected");
        }
      }
    }, 5000);

    // Monitor tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        createWarning("Tab switching detected");
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent copy and paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      createWarning("Copy attempt detected");
      return false;
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      createWarning("Paste attempt detected");
      return false;
    };
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      clearInterval(movementInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const createWarning = (reason: string) => {
    if (!user) return;
    
    setHasWarning(true);
    toast({
      title: "Warning!",
      description: reason,
      variant: "destructive"
    });
    
    addWarning(user.id, assignment.id, reason);
  };

  const currentQuestion: Question = assignment.questions[currentQuestionIndex];

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
            <div className="mb-4">
              <p className="text-lg font-medium mb-4">{currentQuestion.text}</p>
              
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        checked={answers[currentQuestion.id] === option}
                        onChange={() => handleAnswerChange(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === 'text' && (
                <Textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                />
              )}
            </div>
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
        
        <div className="grid grid-cols-5 gap-2">
          {assignment.questions.map((q, idx) => (
            <Button
              key={q.id}
              variant={idx === currentQuestionIndex ? "default" : answers[q.id] ? "outline" : "secondary"}
              className={`w-full ${idx === currentQuestionIndex ? "bg-edu-primary" : answers[q.id] ? "border-edu-primary" : ""}`}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="text-edu-primary" size={20} />
              Proctoring Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto rounded-md"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                LIVE
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Movement level:</span>
                <span className={movementCount > 30 ? "text-edu-danger" : "text-edu-success"}>
                  {movementCount > 30 ? "High" : "Normal"} ({movementCount})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tab switching:</span>
                <span className="text-edu-success">None</span>
              </div>
            </div>

            {hasWarning && (
              <Alert variant="destructive" className="mt-4 animate-pulse-warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning!</AlertTitle>
                <AlertDescription>
                  Suspicious activity detected. This has been reported to your instructor.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TakeAssignment;
