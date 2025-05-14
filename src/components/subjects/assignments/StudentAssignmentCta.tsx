
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { File, CheckCircle } from 'lucide-react';
import { Assignment } from '@/lib/interfaces/types';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/lib/context';
import { getItem, STORAGE_KEYS } from '@/lib/local-storage';

interface StudentAssignmentCtaProps {
  assignments: Assignment[];
  onTakeAssignment: (assignmentId: string) => void;
}

const StudentAssignmentCta: React.FC<StudentAssignmentCtaProps> = ({ 
  assignments
}) => {
  const { toast } = useToast();
  const { user, submissions } = useAppContext();
  const [submittedAssignments, setSubmittedAssignments] = useState<string[]>([]);
  
  useEffect(() => {
    // Track which assignments have been submitted
    if (user && submissions) {
      const userSubmittedAssignments = submissions
        .filter(sub => sub.studentId === user.id)
        .map(sub => sub.assignmentId);
      
      setSubmittedAssignments(userSubmittedAssignments);
    }
  }, [user, submissions]);
  
  if (assignments.length === 0) return null;
  
  const assignment = assignments[0];
  const hasSubmitted = submittedAssignments.includes(assignment.id);
  
  const handleOpenAssignment = () => {
    if (hasSubmitted) {
      toast({
        title: "Already submitted",
        description: "You have already submitted this assignment."
      });
      return;
    }
    
    // Get the current auth user to pass to the new tab
    const authUser = getItem(STORAGE_KEYS.AUTH_USER, null);
    
    // Create a URL with auth data in the state
    const url = `/semester/1/subject/${assignment.subjectId}?tab=assignments&assignmentId=${assignment.id}&mode=take`;
    
    // Open the assignment in a new tab with the session data
    const newWindow = window.open(url, '_blank');
    
    // Store auth data in session storage for the new tab
    if (authUser) {
      // Using sessionStorage which is shared across tabs from the same origin
      sessionStorage.setItem('TEMP_AUTH_USER', JSON.stringify(authUser));
    }
    
    toast({
      title: "Assignment opened",
      description: "Continue your assignment in the new tab."
    });
  };
  
  return (
    <Button 
      onClick={handleOpenAssignment}
      className={`${hasSubmitted ? 'bg-green-600' : 'bg-edu-primary'} mb-4 h-auto py-6 flex flex-col items-center gap-2 w-full`}
      disabled={hasSubmitted}
    >
      {hasSubmitted ? (
        <>
          <CheckCircle size={24} />
          <span className="font-medium">Submitted</span>
          <span className="text-xs text-white/80">
            You have completed this assignment
          </span>
        </>
      ) : (
        <>
          <File size={24} />
          <span className="font-medium">Take Assignment</span>
          <span className="text-xs text-white/80">
            Complete the assessment to get personalized recommendations
          </span>
        </>
      )}
    </Button>
  );
};

export default StudentAssignmentCta;
