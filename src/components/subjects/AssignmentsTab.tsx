
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Subject } from '@/lib/interfaces/types';
import { useToast } from '@/components/ui/use-toast';
import CreateAssignmentForm from '@/components/assignment/CreateAssignmentForm';
import TakeAssignment from '@/components/assignment/TakeAssignment';
import AssignmentEditor from '@/components/assignment/AssignmentEditor';
import SubmissionsView from '@/components/faculty/SubmissionsView';
import AssignmentCreationControls from './assignments/AssignmentCreationControls';
import StudentAssignmentCta from './assignments/StudentAssignmentCta';
import AssignmentList from './assignments/AssignmentList';
import DeleteAssignmentDialog from './assignments/DeleteAssignmentDialog';

interface AssignmentsTabProps {
  subject: Subject;
  showTakeAssignment: boolean;
  setShowTakeAssignment: (show: boolean) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  updateUrlParams: (tab: string, assignmentId?: string | null) => void;
  onCompleteTakeAssignment?: () => void; // New prop
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  subject,
  showTakeAssignment,
  setShowTakeAssignment,
  selectedAssignmentId,
  setSelectedAssignmentId,
  updateUrlParams,
  onCompleteTakeAssignment
}) => {
  const { toast } = useToast();
  const { user, assignments, warnings, deleteAssignment } = useAppContext();
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showAssignmentEditor, setShowAssignmentEditor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const hasWarnings = warnings.some(w => w.assignmentId.startsWith(subject.id));
  
  // Get subject assignments
  const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);
  const selectedAssignment = selectedAssignmentId ? 
    subjectAssignments.find(a => a.id === selectedAssignmentId) : 
    subjectAssignments[0];
  
  const handleAssignmentCreated = () => {
    toast({
      title: "Assignment created",
      description: "The assignment has been successfully created."
    });
  };

  const handleDeleteConfirm = () => {
    if (assignmentToDelete) {
      const success = deleteAssignment(assignmentToDelete);
      if (success) {
        toast({
          title: "Assignment deleted",
          description: "The assignment has been successfully deleted."
        });
        
        // If the deleted assignment was selected, clear the selection
        if (assignmentToDelete === selectedAssignmentId) {
          setSelectedAssignmentId(null);
          updateUrlParams('assignments');
        }
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
  
  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleTakeAssignment = (assignmentId: string) => {
    setShowTakeAssignment(true);
    setSelectedAssignmentId(assignmentId);
    updateUrlParams('assignments', assignmentId);
  };

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    updateUrlParams('assignments', assignmentId);
  };

  const handleAssignmentComplete = () => {
    if (onCompleteTakeAssignment) {
      onCompleteTakeAssignment();
    } else {
      setShowTakeAssignment(false);
      setSelectedAssignmentId(null);
      updateUrlParams('assignments');
      toast({
        title: "Assignment submitted",
        description: "Your assignment has been submitted successfully."
      });
    }
  };
  
  if (showCreateAssignment) {
    return (
      <CreateAssignmentForm 
        subjectId={subject.id} 
        onComplete={() => {
          setShowCreateAssignment(false);
          toast({
            title: "Assignment created",
            description: "The assignment has been successfully created."
          });
        }}
      />
    );
  }
  
  if (showTakeAssignment && selectedAssignment) {
    return (
      <TakeAssignment 
        assignment={selectedAssignment}
        onComplete={handleAssignmentComplete}
      />
    );
  }
  
  if (showAssignmentEditor) {
    return (
      <AssignmentEditor
        onClose={() => setShowAssignmentEditor(false)}
      />
    );
  }
  
  return (
    <div className="mb-6">
      {isTeacherOrAdmin && (
        <AssignmentCreationControls
          subject={subject}
          hasWarnings={hasWarnings}
          onCreateClick={handleAssignmentCreated}
        />
      )}
      
      {!isTeacherOrAdmin && (
        <StudentAssignmentCta 
          assignments={subjectAssignments}
          onTakeAssignment={handleTakeAssignment}
        />
      )}
      
      <AssignmentList
        assignments={subjectAssignments}
        isTeacherOrAdmin={isTeacherOrAdmin}
        onViewSubmissions={handleViewSubmissions}
        onDeleteAssignment={handleDeleteClick}
        onTakeAssignment={handleTakeAssignment}
      />
      
      <DeleteAssignmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDeleteConfirm}
      />
      
      {selectedAssignmentId && isTeacherOrAdmin && (
        <div className="mt-8">
          <SubmissionsView assignmentId={selectedAssignmentId} />
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;
