
import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { Note, Resource } from '@/lib/interfaces/types';

interface UseAssignmentGeneratorProps {
  subjectId: string;
  onAssignmentCreated: () => void;
}

export const useAssignmentGenerator = ({ subjectId, onAssignmentCreated }: UseAssignmentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
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
      selectedResources,
      setSelectedResources,
      dueDate,
      setDueDate,
      enableProctoring,
      setEnableProctoring,
      questionCount,
      setQuestionCount,
      handleNoteToggle: () => {},
      handleResourceToggle: () => {},
      handleGenerate: () => {},
      notes: [],
      resources: [],
    };
  }
  
  const handleNoteToggle = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(prev => prev.filter(id => id !== noteId));
    } else {
      setSelectedNotes(prev => [...prev, noteId]);
    }
  };

  const handleResourceToggle = (resourceId: string) => {
    if (selectedResources.includes(resourceId)) {
      setSelectedResources(prev => prev.filter(id => id !== resourceId));
    } else {
      setSelectedResources(prev => [...prev, resourceId]);
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
    
    if (selectedNotes.length === 0 && selectedResources.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one note or resource to generate questions from",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const notesToUse: Note[] = subject.notes.filter(note => selectedNotes.includes(note.id));
      const resourcesToUse: Resource[] = (subject.resources || []).filter(resource => selectedResources.includes(resource.id));
      
      // Pass the notes and resources to createAssignment for generating questions
      const assignment = createAssignment(
        subjectId, 
        title, 
        dueDate, 
        60, // 60 minutes duration by default
        notesToUse,
        resourcesToUse
      );
      
      toast({
        title: "Success",
        description: `Assignment "${title}" with ${assignment.questions.length} questions created successfully`,
      });
      
      setShowDialog(false);
      setTitle('');
      setSelectedNotes([]);
      setSelectedResources([]);
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
    selectedResources,
    setSelectedResources,
    dueDate,
    setDueDate,
    enableProctoring,
    setEnableProctoring,
    questionCount,
    setQuestionCount,
    handleNoteToggle,
    handleResourceToggle,
    handleGenerate,
    notes: subject.notes,
    resources: subject.resources || [],
  };
};
