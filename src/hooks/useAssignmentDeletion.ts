
import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';

export const useAssignmentDeletion = () => {
  const { toast } = useToast();
  const { deleteAssignment } = useAppContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
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
  
  return {
    showDeleteDialog,
    setShowDeleteDialog,
    assignmentToDelete,
    handleDeleteClick,
    handleDeleteConfirm
  };
};
