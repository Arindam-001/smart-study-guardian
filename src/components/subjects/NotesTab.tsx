
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import NoteItem from '@/components/notes/NoteItem';
import AddNoteForm from '@/components/notes/AddNoteForm';
import { useToast } from '@/components/ui/use-toast';
import { Subject } from '@/lib/interfaces/types';

interface NotesTabProps {
  subject: Subject;
}

const NotesTab: React.FC<NotesTabProps> = ({ subject }) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const { user, deleteNote } = useAppContext();
  const { toast } = useToast();
  
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  
  // Handle note deletion
  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(subject.id, noteId);
      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted."
      });
    }
  };
  
  return (
    <div className="mb-6">
      {isTeacherOrAdmin && !showAddNote && (
        <Button onClick={() => setShowAddNote(true)} className="bg-edu-primary mb-4">
          Add New Note
        </Button>
      )}
      
      {showAddNote && (
        <AddNoteForm 
          subjectId={subject.id} 
          onComplete={() => setShowAddNote(false)}
        />
      )}

      {subject.notes.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-edu-dark">No notes available for this subject yet.</h3>
          {isTeacherOrAdmin && (
            <p className="text-muted-foreground mt-2">Click 'Add New Note' to create your first note.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {subject.notes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              isTeacher={isTeacherOrAdmin}
              onDelete={isTeacherOrAdmin ? () => handleDeleteNote(note.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesTab;
