
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Note, Resource } from '@/lib/interfaces/types'; // Import Resource type
import { format } from 'date-fns';
import AddResourceDialog from '@/components/resources/AddResourceDialog';
import { useAppContext } from '@/lib/context';

interface NoteItemProps {
  note: Note;
  isTeacher: boolean;
  onDelete?: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isTeacher, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const { addResource } = useAppContext();

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const shortContent = note.content.length > 200 
    ? note.content.substring(0, 200) + '...' 
    : note.content;

  // Handle adding a resource related to this note
  const handleResourceAdded = (resource: Partial<Resource>) => {
    if (resource.title && resource.url && resource.type && resource.subjectId) {
      addResource(resource.subjectId, resource.title, resource.url, resource.type);
    }
    setShowAddResource(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-edu-primary">{note.title}</CardTitle>
            <CardDescription>
              Added on {format(new Date(note.createdAt), 'MMMM d, yyyy')}
              {note.updatedAt && note.updatedAt !== note.createdAt && 
                ` · Updated on ${format(new Date(note.updatedAt), 'MMMM d, yyyy')}`
              }
            </CardDescription>
          </div>
          {onDelete && (
            <Button variant="ghost" size="sm" className="text-red-500 h-8 px-2" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {showFullContent ? note.content : shortContent}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {note.content.length > 200 && (
            <Button variant="link" onClick={toggleContent} className="px-0">
              {showFullContent ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>

        {isTeacher && (
          <Button onClick={() => setShowAddResource(true)} variant="outline" size="sm">
            Add Resource
          </Button>
        )}
      </CardFooter>

      {isTeacher && showAddResource && (
        <AddResourceDialog 
          noteTopic={note.title}
          onClose={() => setShowAddResource(false)}
          subjectId={note.subjectId} // Add the subjectId
          onResourceAdded={handleResourceAdded}
        />
      )}
    </Card>
  );
};

export default NoteItem;
