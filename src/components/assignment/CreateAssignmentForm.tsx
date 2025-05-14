
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
import { Note, Resource } from '@/lib/interfaces/types';
import { AlertTriangle, Zap } from 'lucide-react';
import QuickAssignmentGenerator from '@/components/faculty/QuickAssignmentGenerator';

interface CreateAssignmentFormProps {
  subjectId: string;
  onComplete: () => void;
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ subjectId, onComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [dueTime, setDueTime] = useState('23:59');
  const [isCreating, setIsCreating] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [showQuickGenerator, setShowQuickGenerator] = useState(false);
  
  const { subjects, createAssignment } = useAppContext();
  const { toast } = useToast();
  
  const subject = subjects.find(s => s.id === subjectId);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueTime(e.target.value);
  };
  
  const handleCreateAssignment = () => {
    if (!title.trim()) {
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
    
    setIsCreating(true);
    
    try {
      // Combine date and time
      let finalDueDate = dueDate;
      if (dueDate && dueTime) {
        const [hours, minutes] = dueTime.split(':').map(Number);
        finalDueDate = new Date(dueDate);
        finalDueDate.setHours(hours, minutes);
      }
      
      // Get the notes content to use for generating questions
      const notesToUse = subject?.notes.filter(note => 
        selectedNotes.includes(note.id)
      ) || [];
      
      // Get the resources to use for generating questions
      const resourcesToUse = subject?.resources?.filter(resource => 
        selectedResources.includes(resource.id)
      ) || [];
      
      // Create assignment with the specified parameters
      const assignment = createAssignment(subjectId, title, finalDueDate, duration, notesToUse, resourcesToUse);
      
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

  const toggleResourceSelection = (resourceId: string) => {
    if (selectedResources.includes(resourceId)) {
      setSelectedResources(selectedResources.filter(id => id !== resourceId));
    } else {
      setSelectedResources([...selectedResources, resourceId]);
    }
  };

  if (showQuickGenerator) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Quick 20-Question Assignment</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowQuickGenerator(false)}
          >
            Back to Standard Form
          </Button>
        </div>
        
        <QuickAssignmentGenerator 
          subjectId={subjectId} 
          onAssignmentCreated={onComplete}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-edu-primary">Create Assignment</CardTitle>
        <Button 
          variant="secondary" 
          onClick={() => setShowQuickGenerator(true)}
          className="flex items-center gap-1"
        >
          <Zap className="h-4 w-4" />
          Quick 20-Question Assignment
        </Button>
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
            <Label htmlFor="due-time">Due Time</Label>
            <Input
              id="due-time"
              type="time"
              value={dueTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="due-date-display">Assignment Due</Label>
            <div className="bg-gray-100 px-4 py-2 rounded border border-gray-200">
              {dueDate ? (
                <span>
                  {dueDate.toLocaleDateString()} at {dueTime}
                </span>
              ) : (
                <span className="text-muted-foreground">Select a date and time</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Select Notes to Generate Questions From</span>
            <span className="text-xs text-muted-foreground">
              Selected: {selectedNotes.length}
            </span>
          </Label>
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
        
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Select Resources to Generate Questions From</span>
            <span className="text-xs text-muted-foreground">
              Selected: {selectedResources.length}
            </span>
          </Label>
          {subject && subject.resources && subject.resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {subject.resources.map(resource => (
                <div 
                  key={resource.id}
                  className={`border p-2 rounded-md cursor-pointer transition-colors ${
                    selectedResources.includes(resource.id) ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => toggleResourceSelection(resource.id)}
                >
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {resource.type} • {resource.topic}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No resources available. Add some resources before creating an assignment.
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
            disabled={isCreating || !title || (selectedNotes.length === 0 && selectedResources.length === 0)}
          >
            {isCreating ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateAssignmentForm;
