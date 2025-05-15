
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssignmentList from '@/components/subjects/assignments/AssignmentList';
import { Assignment } from '@/lib/interfaces/types';

interface AssignmentsManagementCardProps {
  assignments: Assignment[];
  onViewSubmissions: (assignmentId: string) => void;
  onDeleteAssignment: (assignmentId: string) => void;
}

const AssignmentsManagementCard: React.FC<AssignmentsManagementCardProps> = ({
  assignments,
  onViewSubmissions,
  onDeleteAssignment,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Assignments</CardTitle>
        <CardDescription>
          View and manage assignments for this subject
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssignmentList
          assignments={assignments}
          isTeacherOrAdmin={true}
          onViewSubmissions={onViewSubmissions}
          onDeleteAssignment={onDeleteAssignment}
          onTakeAssignment={() => {}}  // Not used for teachers
        />
      </CardContent>
    </Card>
  );
};

export default AssignmentsManagementCard;
