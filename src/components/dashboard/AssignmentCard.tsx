
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';

interface AssignmentCardProps {
  assignment: Assignment;
  navigateToAssignment: (subjectId: string, semesterId: number, assignmentId: string) => void;
  subjectId: string;
  semesterId: number;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  navigateToAssignment,
  subjectId,
  semesterId
}) => {
  return (
    <div key={assignment.id} className="flex justify-between items-center border-b pb-2">
      <div>
        <div className="font-medium flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          {assignment.title}
        </div>
        <div className="text-sm text-muted-foreground">
          Due: {assignment.dueDate.toLocaleDateString()}
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigateToAssignment(subjectId, semesterId, assignment.id)}
      >
        Take Assignment
      </Button>
    </div>
  );
};

export default AssignmentCard;
