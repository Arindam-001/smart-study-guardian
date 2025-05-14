
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subject, Assignment } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';
import { FileText } from 'lucide-react';

interface AssignmentsTabProps {
  currentSemesterSubjects: Subject[];
  currentSemester: number;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  currentSemesterSubjects,
  currentSemester
}) => {
  const { assignments } = useAppContext();
  
  // Filter assignments for the current semester subjects
  const currentAssignments = assignments.filter(a => 
    currentSemesterSubjects.some(s => s.id === a.subjectId)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Your Assignments</h3>
      
      {currentSemesterSubjects.length > 0 ? (
        <div className="space-y-4">
          {currentSemesterSubjects.map(subject => {
            // Get assignments for this subject
            const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);
            
            return (
              <Card key={subject.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <CardDescription>Semester {currentSemester}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {subjectAssignments.length > 0 ? (
                      <div className="space-y-3">
                        {subjectAssignments.map(assignment => (
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
                              asChild
                            >
                              <Link to={`/semester/${subject.semesterId}/subject/${subject.id}?tab=assignments&assignmentId=${assignment.id}`}>
                                Take Assignment
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          No pending assignments for this subject.
                        </p>
                        <Button 
                          variant="outline" 
                          asChild
                        >
                          <Link to={`/semester/${subject.semesterId}/subject/${subject.id}`}>
                            View Subject Details
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No subjects available for your current semester.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;
