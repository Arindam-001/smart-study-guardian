
import React from 'react';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import { Assignment } from '@/lib/interfaces/types';
import { useToast } from '@/components/ui/use-toast';

interface StudentAssignmentCtaProps {
  assignments: Assignment[];
  onTakeAssignment: (assignmentId: string) => void;
}

const StudentAssignmentCta: React.FC<StudentAssignmentCtaProps> = ({ 
  assignments
}) => {
  const { toast } = useToast();
  
  if (assignments.length === 0) return null;
  
  const handleOpenAssignment = () => {
    const assignment = assignments[0];
    // Open the assignment in a new tab
    window.open(`/semester/1/subject/${assignment.subjectId}?tab=assignments&assignmentId=${assignment.id}&mode=take`, '_blank');
    
    toast({
      title: "Assignment opened",
      description: "Continue your assignment in the new tab."
    });
  };
  
  return (
    <Button 
      onClick={handleOpenAssignment}
      className="bg-edu-primary mb-4 h-auto py-6 flex flex-col items-center gap-2 w-full"
    >
      <File size={24} />
      <span className="font-medium">Take Assignment</span>
      <span className="text-xs text-white/80">
        Complete the assessment to get personalized recommendations
      </span>
    </Button>
  );
};

export default StudentAssignmentCta;
