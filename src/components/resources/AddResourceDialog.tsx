
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Resource } from '@/lib/interfaces/types';

interface AddResourceDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onResourceAdded?: (resource: Partial<Resource>) => void;
  subjectId?: string;
  onClose: () => void;
  noteTopic?: string; // Added this prop to accept the topic from a note
}

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({
  open,
  onOpenChange,
  onResourceAdded,
  subjectId,
  onClose,
  noteTopic
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'video' | 'document' | 'link'>('video');
  const [topic, setTopic] = useState(noteTopic || '');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onResourceAdded && subjectId) {
      onResourceAdded({
        title,
        url,
        type,
        topic: topic || 'general',
        level,
        subjectId
      });
    }
    
    // Reset form
    setTitle('');
    setUrl('');
    setType('video');
    setTopic(noteTopic || '');
    setLevel('intermediate');
    
    // Close the dialog
    onClose();
  };
  
  // If a noteTopic is provided but no open/onOpenChange props, 
  // manage dialog state internally
  const [internalOpen, setInternalOpen] = useState(true);
  
  const effectiveOpen = open !== undefined ? open : internalOpen;
  const effectiveOnOpenChange = onOpenChange || ((newOpen: boolean) => {
    setInternalOpen(newOpen);
    if (!newOpen) onClose();
  });

  return (
    <Dialog open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Resource title"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="url" className="text-sm font-medium">URL</label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com"
              type="url"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">Resource Type</label>
            <Select value={type} onValueChange={(value: 'video' | 'document' | 'link') => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="topic" className="text-sm font-medium">Topic</label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="General"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="level" className="text-sm font-medium">Level</label>
            <Select value={level} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setLevel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceDialog;
