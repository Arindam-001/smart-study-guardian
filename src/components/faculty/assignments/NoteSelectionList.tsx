
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Note } from '@/lib/interfaces/types';

interface NoteSelectionListProps {
  notes: Note[];
  selectedNotes: string[];
  onNoteToggle: (noteId: string) => void;
}

const NoteSelectionList: React.FC<NoteSelectionListProps> = ({
  notes,
  selectedNotes,
  onNoteToggle,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base">Select Notes to Generate From</Label>
        <span className="text-xs text-muted-foreground">
          {selectedNotes.length} selected
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className={`flex items-start p-2 border rounded hover:bg-muted transition-colors cursor-pointer ${
                selectedNotes.includes(note.id) ? 'bg-primary/10 border-primary' : ''
              }`}
              onClick={() => onNoteToggle(note.id)}
            >
              <Checkbox 
                checked={selectedNotes.includes(note.id)}
                className="mt-1 mr-2"
                onCheckedChange={() => {}}
              />
              <div className="space-y-1">
                <p className="font-medium text-sm">{note.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {note.content.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-4 text-center text-muted-foreground">
            No notes available. Add some notes first.
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteSelectionList;
