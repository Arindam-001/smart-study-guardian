
import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface AssignmentCardProps {
  assignment: Assignment;
  subjectId: string;
  semesterId: number;
  navigateToAssignment: (subjectId: string, semesterId: number, assignmentId: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  subjectId,
  semesterId,
  navigateToAssignment
}) => {
  const { toast } = useToast();
  
  // Format the due date nicely
  const formattedDueDate = format(assignment.dueDate, "PPP 'at' p");
  
  const handleOpenAssignment = () => {
    // Open the assignment in a new tab
    window.open(`/semester/${semesterId}/subject/${subjectId}?tab=assignments&assignmentId=${assignment.id}&mode=take`, '_blank');
    
    toast({
      title: "Assignment opened",
      description: "Continue your assignment in the new tab."
    });
  };
  
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
        onClick={handleOpenAssignment}
      >
        Take Assignment
      </Button>
    </div>
  );
};

export default AssignmentCard;
