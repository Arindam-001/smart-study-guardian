
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Note } from '@/lib/interfaces/types';
import { format } from 'date-fns';
import AddResourceDialog from '@/components/resources/AddResourceDialog';

interface NoteItemProps {
  note: Note;
  isTeacher: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isTeacher }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const shortContent = note.content.length > 200 
    ? note.content.substring(0, 200) + '...' 
    : note.content;

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
        />
      )}
    </Card>
  );
};

export default NoteItem;
