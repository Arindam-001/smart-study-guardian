
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Note } from '@/lib/interfaces/types';
import { format } from 'date-fns';

interface NoteItemProps {
  note: Note;
  isTeacher: boolean;
}

const NoteItem = ({ note, isTeacher }: NoteItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="mb-4 transition-all duration-300">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-edu-primary flex justify-between items-center">
          <span>{note.title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {format(new Date(note.updatedAt), 'dd MMM yyyy')}
          </span>
        </CardTitle>
        <CardDescription>
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="prose max-w-none">
            <p>{note.content}</p>
          </div>
          
          {isTeacher && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="mr-2">Edit Note</Button>
              <Button variant="destructive">Delete Note</Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default NoteItem;
