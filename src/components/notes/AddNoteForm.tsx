
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { useAppContext } from '@/lib/context';

interface AddNoteFormProps {
  subjectId: string;
  onComplete?: () => void;
}

const AddNoteForm = ({ subjectId, onComplete }: AddNoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNote } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addNote(subjectId, { title, content });
      toast({
        title: 'Note Added',
        description: 'The note has been added successfully.',
      });
      setTitle('');
      setContent('');
      if (onComplete) onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add the note.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-edu-primary">Add New Note</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content here..."
              rows={5}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-edu-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Note'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddNoteForm;
