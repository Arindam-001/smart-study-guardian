
import React from 'react';
import { Subject, Assignment } from '@/lib/interfaces/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AssignmentCard from './AssignmentCard';
import EmptyAssignmentState from './EmptyAssignmentState';

interface SubjectAssignmentsCardProps {
  subject: Subject;
  subjectAssignments: Assignment[];
  currentSemester: number;
  navigateToAssignment: (subjectId: string, semesterId: number, assignmentId: string) => void;
}

const SubjectAssignmentsCard: React.FC<SubjectAssignmentsCardProps> = ({
  subject,
  subjectAssignments,
  currentSemester,
  navigateToAssignment
}) => {
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
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  navigateToAssignment={navigateToAssignment}
                  subjectId={subject.id}
                  semesterId={subject.semesterId}
                />
              ))}
            </div>
          ) : (
            <EmptyAssignmentState 
              subjectId={subject.id} 
              semesterId={subject.semesterId} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectAssignmentsCard;
