
import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';
import { format } from 'date-fns';

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
  // Format the due date nicely
  const formattedDueDate = format(assignment.dueDate, "PPP 'at' p");
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
      <div className="mb-2 md:mb-0">
        <div className="font-medium flex items-center">
          <FileText className="h-5 w-5 mr-2 text-edu-primary" />
          {assignment.title}
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Due: {formattedDueDate}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {assignment.questions.length} questions • {assignment.duration || 30} minutes
        </div>
      </div>
      <Button 
        className="bg-edu-primary" 
        onClick={() => navigateToAssignment(subjectId, semesterId, assignment.id)}
      >
        Take Assignment
      </Button>
    </div>
  );
};

export default AssignmentCard;
