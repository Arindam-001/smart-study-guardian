
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/lib/interfaces/types';

interface ManageNotesTabProps {
  notes: Note[];
}

const ManageNotesTab: React.FC<ManageNotesTabProps> = ({ notes }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Subject Notes</h3>
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
                  >
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
