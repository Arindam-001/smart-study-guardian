
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { useAppContext } from '@/lib/context';

interface CreateAssignmentFormProps {
  subjectId: string;
  onComplete?: () => void;
}

const CreateAssignmentForm = ({ subjectId, onComplete }: CreateAssignmentFormProps) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createAssignment } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      createAssignment(subjectId, title);
      
      toast({
        title: 'Assignment Created',
        description: '20 questions have been automatically generated based on the notes.',
      });
      
      setTitle('');
      if (onComplete) onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create the assignment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-edu-primary">Create Assignment</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Midterm Assignment"
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            System will automatically generate 20 questions based on the available notes for this subject.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-edu-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateAssignmentForm;
