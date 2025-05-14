
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import NoteSelectionList from './NoteSelectionList';
import AssignmentFormConfig from './AssignmentFormConfig';
import { Note } from '@/lib/interfaces/types';

interface AssignmentCreationDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  selectedNotes: string[];
  onNoteToggle: (noteId: string) => void;
  dueDate: Date;
  setDueDate: (date: Date | undefined) => void;
  enableProctoring: boolean;
  setEnableProctoring: (enable: boolean) => void;
  questionCount: string;
  setQuestionCount: (count: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  notes: Note[];
}

const AssignmentCreationDialog: React.FC<AssignmentCreationDialogProps> = ({
  showDialog,
  setShowDialog,
  title,
  setTitle,
  selectedNotes,
  onNoteToggle,
  dueDate,
  setDueDate,
  enableProctoring,
  setEnableProctoring,
  questionCount,
  setQuestionCount,
  handleGenerate,
  isGenerating,
  notes
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Generate an assignment with AI-based questions from your class notes
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !title || selectedNotes.length === 0}
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
