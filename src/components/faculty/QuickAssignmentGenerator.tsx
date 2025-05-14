
import React from 'react';
import QuickAssignmentCard from './assignments/QuickAssignmentCard';
import AssignmentCreationDialog from './assignments/AssignmentCreationDialog';
import { useAssignmentGenerator } from './assignments/useAssignmentGenerator';

interface QuickAssignmentGeneratorProps {
  subjectId: string;
  onAssignmentCreated: () => void;
}

const QuickAssignmentGenerator: React.FC<QuickAssignmentGeneratorProps> = ({
  subjectId,
  onAssignmentCreated,
}) => {
  const {
    isGenerating,
    showDialog,
    setShowDialog,
    title,
    setTitle,
    selectedNotes,
    selectedResources,
    dueDate,
    setDueDate,
    enableProctoring,
    setEnableProctoring,
    questionCount,
    setQuestionCount,
    handleNoteToggle,
    handleResourceToggle,
    handleGenerate,
    notes,
    resources,
  } = useAssignmentGenerator({ subjectId, onAssignmentCreated });

  return (
    <>
      <QuickAssignmentCard onCreateClick={() => setShowDialog(true)} />

      <AssignmentCreationDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        title={title}
        setTitle={setTitle}
        selectedNotes={selectedNotes}
        onNoteToggle={handleNoteToggle}
        selectedResources={selectedResources}
        onResourceToggle={handleResourceToggle}
        dueDate={dueDate}
        setDueDate={setDueDate}
        enableProctoring={enableProctoring}
        setEnableProctoring={setEnableProctoring}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        handleGenerate={handleGenerate}
        isGenerating={isGenerating}
        notes={notes}
        resources={resources}
      />
    </>
  );
};

export default QuickAssignmentGenerator;
