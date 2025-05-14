
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Assignment } from '@/lib/interfaces/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AssignmentList from '../subjects/assignments/AssignmentList';
import DeleteAssignmentDialog from '../subjects/assignments/DeleteAssignmentDialog';

interface ManageAssignmentsTabProps {
  subjectId: string;
  onAssignmentAdded: () => void;
}

const ManageAssignmentsTab: React.FC<ManageAssignmentsTabProps> = ({ 
  subjectId,
  onAssignmentAdded 
}) => {
  const { toast } = useToast();
  const { assignments, deleteAssignment } = useAppContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
  // Get subject assignments
  const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
  
  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (assignmentToDelete) {
      const success = deleteAssignment(assignmentToDelete);
      if (success) {
        toast({
          title: "Assignment deleted",
          description: "The assignment has been successfully deleted."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete assignment",
          variant: "destructive"
        });
      }
      setShowDeleteDialog(false);
      setAssignmentToDelete(null);
    }
  };

  const handleViewSubmissions = (assignmentId: string) => {
    // For now, just show a toast. In future, this could navigate to a submissions view
    toast({
      title: "View Submissions",
      description: `Viewing submissions for assignment ${assignmentId}`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Assignments</CardTitle>
          <CardDescription>
            View and manage assignments for this subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentList
            assignments={subjectAssignments}
            isTeacherOrAdmin={true}
            onViewSubmissions={handleViewSubmissions}
            onDeleteAssignment={handleDeleteClick}
            onTakeAssignment={() => {}}  // Not used for teachers
          />
        </CardContent>
      </Card>

      <DeleteAssignmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageAssignmentsTab;
