
import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/components/ui/use-toast';
import { Note, Resource, Question } from '@/lib/interfaces/types';

interface UseAssignmentGeneratorProps {
  subjectId: string;
  onAssignmentCreated: () => void;
}

// Helper function to generate questions from content using simulated NLP
const generateQuestionsFromContent = (content: string[], count: number): Question[] => {
  const questions: Question[] = [];
  
  // Basic question templates
  const templates = [
    { prefix: "What is ", suffix: "?" },
    { prefix: "Explain the concept of ", suffix: "." },
    { prefix: "Define ", suffix: "." },
    { prefix: "How would you describe ", suffix: "?" },
    { prefix: "Compare and contrast ", suffix: " with related concepts." },
    { prefix: "What are the main characteristics of ", suffix: "?" },
    { prefix: "Discuss the importance of ", suffix: "." },
    { prefix: "Analyze the role of ", suffix: " in this context." },
  ];
  
  // Extract important keywords from content
  const keywords: string[] = [];
  content.forEach(text => {
    // Simple keyword extraction - split by spaces and punctuation
    const words = text.split(/[\s.,;:!?()[\]{}'"\/\\<>-]+/).filter(word => 
      word.length > 3 && !["this", "that", "with", "from", "about", "which", "these", "those"].includes(word.toLowerCase())
    );
    
    keywords.push(...words);
  });
  
  // Generate unique keywords array
  const uniqueKeywords = [...new Set(keywords)];
  
  // Generate questions
  for (let i = 0; i < Math.min(count, uniqueKeywords.length * templates.length); i++) {
    const keywordIndex = i % uniqueKeywords.length;
    const templateIndex = Math.floor(i / uniqueKeywords.length) % templates.length;
    
    const keyword = uniqueKeywords[keywordIndex];
    const template = templates[templateIndex];
    
    const questionId = `q_${Date.now()}_${i}`;
    const questionText = `${template.prefix}${keyword}${template.suffix}`;
    
    // Generate multiple choice options (basic implementation)
    const options = [
      { id: `${questionId}_opt_a`, text: `Option A related to ${keyword}` },
      { id: `${questionId}_opt_b`, text: `Option B related to ${keyword}` },
      { id: `${questionId}_opt_c`, text: `Option C related to ${keyword}` },
      { id: `${questionId}_opt_d`, text: `Option D related to ${keyword}` },
    ];
    
    questions.push({
      id: questionId,
      text: questionText,
      options,
      correctOptionId: options[0].id, // First option as correct by default
      explanation: `This question tests understanding of ${keyword}.`
    });
  }
  
  return questions;
};

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
      
      // Extract content from notes and resources
      const contentToAnalyze: string[] = [
        ...notesToUse.map(note => note.content),
        ...resourcesToUse.map(resource => resource.title + ' ' + (resource.description || '') + ' ' + (resource.topic || ''))
      ];
      
      // Generate questions using our NLP simulator
      const generatedQuestions = generateQuestionsFromContent(contentToAnalyze, parseInt(questionCount) || 20);
      
      // Create assignment with generated questions
      const assignment = createAssignment(
        subjectId, 
        title, 
        dueDate, 
        60, // 60 minutes duration by default
        notesToUse,
        resourcesToUse
      );
      
      // Update the assignment with the generated questions
      assignment.questions = generatedQuestions;
      
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
      console.error("Error generating assignment:", error);
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
    selectedNotes,
    selectedResources,
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
    notes: subject.notes,
    resources: subject.resources || [],
  };
};
