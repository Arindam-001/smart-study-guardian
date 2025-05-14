
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/lib/context';
import { useParams } from 'react-router-dom';
import { ResourceLevel, Resource } from '@/lib/interfaces/types';

interface AddResourceDialogProps {
  subjectId?: string;
  noteTopic?: string;
  onClose: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onResourceAdded?: (resource: Resource) => void;
}

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ 
  onClose, 
  noteTopic = '', 
  subjectId: propSubjectId,
  open = true, 
  onOpenChange,
  onResourceAdded
}) => {
  const { subjectId: urlSubjectId } = useParams<{ subjectId: string }>();
  const { toast } = useToast();
  const { addResource } = useAppContext();
  
  const subjectId = propSubjectId || urlSubjectId;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'video' | 'document' | 'link'>('video');
  const [level, setLevel] = useState<ResourceLevel>('intermediate');
  const [topic, setTopic] = useState(noteTopic || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!title || !url || !topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!subjectId) {
      toast({
        title: "Error",
        description: "Subject ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const resource = addResource(subjectId, {
        title,
        description,
        url,
        type,
        level,
        topic,
      });

      toast({
        title: "Resource Added",
        description: "The resource has been added successfully",
      });

      if (onResourceAdded) {
        onResourceAdded(resource);
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Learning Resource</DialogTitle>
          <DialogDescription>
            Add a resource for students based on their proficiency level
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select value={type} onValueChange={(value: 'video' | 'document' | 'link') => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Proficiency Level</Label>
              <Select value={level} onValueChange={(value: ResourceLevel) => setLevel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Resource topic"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceDialog;
