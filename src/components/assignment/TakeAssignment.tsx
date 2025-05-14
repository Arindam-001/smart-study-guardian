
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
import { AlertTriangle, FileText, Book, Youtube, FileWord, Presentation } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignmentEditor from './AssignmentEditor';

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

  // Simulate YouTube video recommendations based on performance
  const generateYouTubeRecommendations = (studentPerformance: any) => {
    const weakTopics = Object.entries(studentPerformance.topics)
      .filter(([_, data]: [string, any]) => data.correct / data.total < 0.6)
      .map(([topic]) => topic);
    
    // Simulated YouTube video recommendations
    const recommendations = weakTopics.map(topic => ({
      id: `vid-${Math.random().toString(36).substring(2, 10)}`,
      title: `Understanding ${topic} - Complete Tutorial`,
      channelName: `EduTech Academy`,
      thumbnailUrl: `https://picsum.photos/seed/${topic}/320/180`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+tutorial`,
      topic: topic,
      duration: '12:34',
      views: '256K'
    }));
    
    return recommendations;
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
        const recommendations = generateYoutubeRecommendations(results);
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
              <Tabs defaultValue="recommendations">
                <TabsList>
                  <TabsTrigger value="recommendations" className="flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    <span>Learning Resources</span>
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    <span>Recommended Videos</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendations" className="mt-4">
                  <h3 className="text-lg font-medium mb-4">Personalized Recommendations</h3>
                  <RecommendationsCard resources={performance.recommendedResources} />
                </TabsContent>
                
                <TabsContent value="videos" className="mt-4">
                  <h3 className="text-lg font-medium mb-4">Recommended YouTube Videos</h3>
                  {youtubeRecommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {youtubeRecommendations.map(video => (
                        <div key={video.id} className="border rounded-md overflow-hidden">
                          <div className="relative aspect-video bg-gray-100">
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-black text-white px-1 text-xs rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium line-clamp-2">{video.title}</h4>
                            <div className="text-sm text-muted-foreground flex justify-between mt-1">
                              <span>{video.channelName}</span>
                              <span>{video.views} views</span>
                            </div>
                            <div className="mt-2">
                              <a 
                                href={video.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-edu-primary text-sm hover:underline"
                              >
                                Watch on YouTube
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <p className="text-muted-foreground">No video recommendations available.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
              {assignment.title}
              {activeTab === 'questions' && (
                <span className="ml-2">
                  - Question {currentQuestionIndex + 1} of {assignment.questions.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="word" className="flex items-center gap-1">
                  <FileWord className="h-4 w-4" />MS Word
                </TabsTrigger>
                <TabsTrigger value="ppt" className="flex items-center gap-1">
                  <Presentation className="h-4 w-4" />MS PowerPoint
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions">
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
              </TabsContent>
              
              <TabsContent value="word">
                <AssignmentEditor onClose={() => setActiveTab('questions')} type="word" />
              </TabsContent>
              
              <TabsContent value="ppt">
                <AssignmentEditor onClose={() => setActiveTab('questions')} type="powerpoint" />
              </TabsContent>
            </Tabs>
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
        
        {tabSwitchCount > 0 && (
          <Card className="mt-4 border-red-200">
            <CardContent className="pt-4">
              <div className="flex items-center text-red-600 mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Warning</h3>
              </div>
              <p className="text-sm">
                You have switched tabs {tabSwitchCount} {tabSwitchCount === 1 ? 'time' : 'times'}. 
                Your assignment will be automatically submitted after 3 violations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TakeAssignment;
