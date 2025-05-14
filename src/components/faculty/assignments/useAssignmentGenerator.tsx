
import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/lib/interfaces/types';

interface UseAssignmentGeneratorProps {
  subjectId: string;
  onAssignmentCreated: () => void;
}

export const useAssignmentGenerator = ({ subjectId, onAssignmentCreated }: UseAssignmentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [enableProctoring, setEnableProctoring] = useState(true);
  const [questionCount, setQuestionCount] = useState("20");
  
  const { subjects, createAssignment } = useAppContext();
  const { toast } = useToast();
  
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return {
      isGenerating,
      showDialog,
      setShowDialog,
      title,
      setTitle,
      selectedNotes,
      setSelectedNotes,
      dueDate,
      setDueDate,
      enableProctoring,
      setEnableProctoring,
      questionCount,
      setQuestionCount,
      handleNoteToggle: () => {},
      handleGenerate: () => {},
      notes: [],
    };
  }
  
  const handleNoteToggle = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(prev => prev.filter(id => id !== noteId));
    } else {
      setSelectedNotes(prev => [...prev, noteId]);
    }
  };
  
  const handleGenerate = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for the assignment",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedNotes.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one note to generate questions from",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const notesToUse: Note[] = subject.notes.filter(note => selectedNotes.includes(note.id));
      
      // Pass the notes to createAssignment for generating questions
      const assignment = createAssignment(
        subjectId, 
        title, 
        dueDate, 
        60, // 60 minutes duration by default
        notesToUse
      );
      
      toast({
        title: "Success",
        description: `Assignment "${title}" with ${assignment.questions.length} questions created successfully`,
      });
      
      setShowDialog(false);
      setTitle('');
      setSelectedNotes([]);
      onAssignmentCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate assignment",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    showDialog,
    setShowDialog,
    title,
    setTitle,
    selectedNotes,
    setSelectedNotes,
    dueDate,
    setDueDate,
    enableProctoring,
    setEnableProctoring,
    questionCount,
    setQuestionCount,
    handleNoteToggle,
    handleGenerate,
    notes: subject.notes,
  };
};
