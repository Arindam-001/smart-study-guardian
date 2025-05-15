
import React from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import DeleteAssignmentDialog from '../subjects/assignments/DeleteAssignmentDialog';
import AssignmentsManagementCard from './assignments/AssignmentsManagementCard';
import { useAssignmentDeletion } from '@/hooks/useAssignmentDeletion';

interface ManageAssignmentsTabProps {
  subjectId: string;
  onAssignmentAdded: () => void;
}

const ManageAssignmentsTab: React.FC<ManageAssignmentsTabProps> = ({ 
  subjectId,
  onAssignmentAdded 
}) => {
  const { toast } = useToast();
  const { assignments } = useAppContext();
  
  // Use the assignment deletion hook
  const {
    showDeleteDialog, 
    setShowDeleteDialog,
    handleDeleteClick,
    handleDeleteConfirm
  } = useAssignmentDeletion();
  
  // Get subject assignments
  const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
  
  const handleViewSubmissions = (assignmentId: string) => {
    // For now, just show a toast. In future, this could navigate to a submissions view
    toast({
      title: "View Submissions",
      description: `Viewing submissions for assignment ${assignmentId}`
    });
  };

  return (
    <div className="space-y-6">
      <AssignmentsManagementCard
        assignments={subjectAssignments}
        onViewSubmissions={handleViewSubmissions}
        onDeleteAssignment={handleDeleteClick}
      />

      <DeleteAssignmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageAssignmentsTab;
