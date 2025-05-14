
import React from 'react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';
import { Trash2, Eye, Calendar, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

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
      <h3 className="text-lg font-medium">Assignments ({assignments.length})</h3>
      <div className="grid grid-cols-1 gap-4">
        {assignments.map(assignment => (
          <Card 
            key={assignment.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary h-5 w-5" />
                    <h4 className="font-medium text-lg">{assignment.title}</h4>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {format(new Date(assignment.dueDate), 'PPP')}</span>
                  </div>
                  <div className="text-sm mt-1">
                    {assignment.questions.length} questions • {assignment.duration || 30} minutes
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-center">
                  {isTeacherOrAdmin ? (
                    <>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onViewSubmissions(assignment.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Submissions</span>
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteAssignment(assignment.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </Button>
                    </>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
