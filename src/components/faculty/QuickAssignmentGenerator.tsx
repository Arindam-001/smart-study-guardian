
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileText, Book, Clock, Shield } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Note } from '@/lib/interfaces/types';

interface QuickAssignmentGeneratorProps {
  subjectId: string;
  onAssignmentCreated: () => void;
}

const QuickAssignmentGenerator: React.FC<QuickAssignmentGeneratorProps> = ({
  subjectId,
  onAssignmentCreated,
}) => {
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
    return null;
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
      const notesToUse = subject.notes.filter(note => selectedNotes.includes(note.id));
      
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

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-edu-primary">
            <Shield className="h-5 w-5" />
            Quick Assignment Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate a new assignment with AI-created questions based on your notes materials.
          </p>
          <Button 
            onClick={() => setShowDialog(true)} 
            className="w-full bg-edu-primary"
          >
            <FileText className="mr-2 h-4 w-4" />
            Create New Assignment
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Generate an assignment with AI-based questions from your class notes
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                placeholder="Enter assignment title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <DatePicker date={dueDate} setDate={setDueDate} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="questions">Number of Questions</Label>
                <Select defaultValue={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="20 Questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="25">25 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Select Notes to Generate From</Label>
                <span className="text-xs text-muted-foreground">
                  {selectedNotes.length} selected
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                {subject.notes.length > 0 ? (
                  subject.notes.map((note) => (
                    <div
                      key={note.id}
                      className={`flex items-start p-2 border rounded hover:bg-muted transition-colors cursor-pointer ${
                        selectedNotes.includes(note.id) ? 'bg-primary/10 border-primary' : ''
                      }`}
                      onClick={() => handleNoteToggle(note.id)}
                    >
                      <Checkbox 
                        checked={selectedNotes.includes(note.id)}
                        className="mt-1 mr-2"
                        onCheckedChange={() => {}}
                      />
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{note.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {note.content.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-4 text-center text-muted-foreground">
                    No notes available. Add some notes first.
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="proctoring"
                checked={enableProctoring}
                onCheckedChange={() => setEnableProctoring(!enableProctoring)}
              />
              <label
                htmlFor="proctoring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable proctoring (camera monitoring, tab switching detection)
              </label>
            </div>
          </div>
          
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
    </>
  );
};

export default QuickAssignmentGenerator;
