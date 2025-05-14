
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import NoteSelectionList from './NoteSelectionList';
import ResourceSelectionList from './ResourceSelectionList';
import AssignmentFormConfig from './AssignmentFormConfig';
import { Note, Resource } from '@/lib/interfaces/types';

interface AssignmentCreationDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  selectedNotes: string[];
  onNoteToggle: (noteId: string) => void;
  selectedResources: string[];
  onResourceToggle: (resourceId: string) => void;
  dueDate: Date;
  setDueDate: (date: Date | undefined) => void;
  enableProctoring: boolean;
  setEnableProctoring: (enable: boolean) => void;
  questionCount: string;
  setQuestionCount: (count: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  notes: Note[];
  resources: Resource[];
}

const AssignmentCreationDialog: React.FC<AssignmentCreationDialogProps> = ({
  showDialog,
  setShowDialog,
  title,
  setTitle,
  selectedNotes,
  onNoteToggle,
  selectedResources,
  onResourceToggle,
  dueDate,
  setDueDate,
  enableProctoring,
  setEnableProctoring,
  questionCount,
  setQuestionCount,
  handleGenerate,
  isGenerating,
  notes,
  resources
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Generate an assignment with AI-based questions from your class notes and resources
          </DialogDescription>
        </DialogHeader>
        
        <AssignmentFormConfig
          title={title}
          setTitle={setTitle}
          dueDate={dueDate}
          setDueDate={setDueDate}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          enableProctoring={enableProctoring}
          setEnableProctoring={setEnableProctoring}
        />
        
        <NoteSelectionList
          notes={notes}
          selectedNotes={selectedNotes}
          onNoteToggle={onNoteToggle}
        />

        <ResourceSelectionList
          resources={resources}
          selectedResources={selectedResources}
          onResourceToggle={onResourceToggle}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !title || (selectedNotes.length === 0 && selectedResources.length === 0)}
            className="bg-edu-primary"
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Assignment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentCreationDialog;
