
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Note } from '@/lib/interfaces/types';

interface CreateAssignmentFormProps {
  subjectId: string;
  onComplete: () => void;
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ subjectId, onComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [isCreating, setIsCreating] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 minutes
  
  const { subjects, createAssignment } = useAppContext();
  const { toast } = useToast();
  
  const subject = subjects.find(s => s.id === subjectId);
  
  const handleCreateAssignment = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the assignment",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Get the notes content to use for generating questions
      const notesToUse = subject?.notes.filter(note => 
        selectedNotes.includes(note.id)
      ) || [];
      
      // Create assignment with the specified parameters
      const assignment = createAssignment(subjectId, title, dueDate, duration, notesToUse);
      
      toast({
        title: "Success",
        description: `Assignment "${title}" created with ${assignment.questions.length} questions`
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const toggleNoteSelection = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter(id => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-edu-primary">Create Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Assignment Title</Label>
          <Input 
            id="title"
            placeholder="Enter assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea 
            id="description"
            placeholder="Enter assignment description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <DatePicker 
              date={dueDate} 
              setDate={setDueDate}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input 
              id="duration"
              type="number"
              min="10"
              max="240"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Select Notes to Generate Questions From</Label>
          {subject && subject.notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {subject.notes.map(note => (
                <div 
                  key={note.id}
                  className={`border p-2 rounded-md cursor-pointer transition-colors ${
                    selectedNotes.includes(note.id) ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => toggleNoteSelection(note.id)}
                >
                  <div className="font-medium">{note.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {note.content.substring(0, 60)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No notes available. Add some notes before creating an assignment.
            </div>
          )}
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onComplete}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAssignment}
            disabled={isCreating || !title || selectedNotes.length === 0}
          >
            {isCreating ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateAssignmentForm;
