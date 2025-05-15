
import { useEffect } from 'react';
import { Assignment } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';
import { usePerformanceTracking } from './usePerformanceTracking';
import { useSubmission } from './useSubmission';

interface UseAssignmentSubmissionProps {
  assignment: Assignment;
  answers: Record<string, string>;
  file: File | null;
  streamRef: React.MutableRefObject<MediaStream | null>;
  createWarning: (reason: string) => void;
  onSubmitComplete?: () => void;
}

export const useAssignmentSubmission = ({
  assignment,
  answers,
  file,
  streamRef,
  createWarning,
  onSubmitComplete
}: UseAssignmentSubmissionProps) => {
  const { user, submitAssignment } = useAppContext();
  const { isSubmitting, submitted, startSubmission, completeSubmission, setSubmitting } = useSubmission();
  const { performance, youtubeRecommendations, processPerformanceResults, toast } = usePerformanceTracking();

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
    
    startSubmission();
    
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
        
        // Include student name and ID in the submission
        const submissionWithUserDetails = {
          assignmentId: assignment.id,
          studentId: user.id,
          studentName: user.name,
          answers: answers,
          fileUrl: mockFileUrl
        };
        
        console.log("Submitting assignment with student details:", submissionWithUserDetails);
        
        // Use NLP to analyze answers and provide recommendations (simulated)
        console.log("Performing NLP analysis on student answers...");
        
        // Submit and get recommendations
        const results = submitAssignment(assignment.id, user.id, answers, mockFileUrl);
        const { recommendations } = processPerformanceResults(results);
        
        toast({
          title: autoSubmitted ? "Assignment Auto-Submitted" : "Assignment Submitted",
          description: `Your score: ${results.score}/${assignment.questions.length}. Check your recommendations!`,
          variant: autoSubmitted ? "destructive" : "default"
        });
        
        // Notify that the assignment was submitted to teacher
        toast({
          title: "Assignment Sent to Teacher",
          description: `Your assignment has been sent to your teacher for review.`,
          variant: "default"
        });
        
        // Call the completion callback after a delay to allow the user to see results
        if (onSubmitComplete) {
          setTimeout(() => {
            onSubmitComplete();
          }, 5000);
        }
        
        completeSubmission();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit assignment",
          variant: "destructive"
        });
      } finally {
        setSubmitting(false);
        
        // Stop the camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    }, 1500);
  };

  return {
    isSubmitting,
    submitted,
    performance,
    youtubeRecommendations,
    handleSubmit
  };
};
