
import React from 'react';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import { Assignment } from '@/lib/interfaces/types';

interface StudentAssignmentCtaProps {
  assignments: Assignment[];
  onTakeAssignment: (assignmentId: string) => void;
}

const StudentAssignmentCta: React.FC<StudentAssignmentCtaProps> = ({ 
  assignments, 
  onTakeAssignment 
}) => {
  if (assignments.length === 0) return null;
  
  return (
    <Button 
      onClick={() => onTakeAssignment(assignments[0].id)}
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
