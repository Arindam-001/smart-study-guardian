
import React from 'react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';
import { Trash2 } from 'lucide-react';

interface AssignmentListProps {
  assignments: Assignment[];
  isTeacherOrAdmin: boolean;
  onViewSubmissions: (assignmentId: string) => void;
  onDeleteAssignment: (assignmentId: string) => void;
  onTakeAssignment: (assignmentId: string) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  isTeacherOrAdmin,
  onViewSubmissions,
  onDeleteAssignment,
  onTakeAssignment
}) => {
  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-edu-dark">No active assignments</h3>
        {isTeacherOrAdmin ? (
          <p className="text-muted-foreground mt-2">Create a new assignment for your students.</p>
        ) : (
          <p className="text-muted-foreground mt-2">No assignments available for this subject.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Assignments</h3>
      <div className="grid grid-cols-1 gap-4">
        {assignments.map(assignment => (
          <div 
            key={assignment.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <h4 className="font-medium">{assignment.title}</h4>
                <div className="text-sm text-muted-foreground">
                  Due: {assignment.dueDate.toLocaleString()}
                </div>
                <div className="text-sm">
                  {assignment.questions.length} questions • {assignment.duration || 30} minutes
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isTeacherOrAdmin ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => onViewSubmissions(assignment.id)}
                    >
                      View Submissions
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteAssignment(assignment.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => onTakeAssignment(assignment.id)}
                  >
                    Take Assignment
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
