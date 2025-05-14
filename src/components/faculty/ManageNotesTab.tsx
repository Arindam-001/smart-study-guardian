
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/lib/interfaces/types';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/lib/context';
import { PlusCircle, Eye } from 'lucide-react';
import AddNoteForm from '@/components/notes/AddNoteForm';

interface ManageNotesTabProps {
  notes: Note[];
  selectedSubject: string;
  onNoteAdded?: () => void;
}

const ManageNotesTab: React.FC<ManageNotesTabProps> = ({ notes, selectedSubject, onNoteAdded }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const { addNote } = useAppContext();

  const handleAddNote = (title: string, content: string) => {
    if (selectedSubject) {
      addNote(selectedSubject, { title, content });
      setShowAddNote(false);
      if (onNoteAdded) {
        onNoteAdded();
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Subject Notes</h3>
        <Button 
          onClick={() => setShowAddNote(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Add New Note</span>
        </Button>
      </div>

      {showAddNote && (
        <div className="mb-6">
          <AddNoteForm 
            subjectId={selectedSubject} 
            onComplete={() => {
              setShowAddNote(false);
              if (onNoteAdded) onNoteAdded();
            }}
          />
        </div>
      )}

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.length > 0 ? notes.map(note => (
              <TableRow key={note.id}>
                <TableCell>{note.title}</TableCell>
                <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(note.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedNote(note)}
                    className="flex items-center gap-1"
                  >
                    <Eye size={14} />
                    View Note
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No notes added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Note Dialog */}
      <Dialog open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedNote && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNote.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="prose max-w-none">
                  <Textarea
                    value={selectedNote.content}
                    className="w-full min-h-[300px]"
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageNotesTab;
