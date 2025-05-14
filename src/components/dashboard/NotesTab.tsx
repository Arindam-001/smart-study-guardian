
import React from 'react';
import { Subject } from '@/lib/interfaces/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NoteItem from '@/components/notes/NoteItem';

interface NotesTabProps {
  subjects: Subject[];
  selectedSubject: string | null;
  setSelectedSubject: (subjectId: string) => void;
}

const NotesTab: React.FC<NotesTabProps> = ({ 
  subjects, 
  selectedSubject, 
  setSelectedSubject 
}) => {
  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h3 className="text-xl font-medium">Subject Notes</h3>
        
        <Select 
          value={selectedSubject || ''} 
          onValueChange={setSelectedSubject}
        >
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSubject ? (
        <div>
          {currentSubject?.notes && currentSubject.notes.length > 0 ? (
            <div className="space-y-4">
              {currentSubject.notes.map(note => (
                <NoteItem 
                  key={note.id} 
                  note={note} 
                  isTeacher={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-edu-dark">No notes available for this subject</h3>
              <p className="text-muted-foreground mt-2">Check back later for updates from your instructor.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-edu-dark">Select a subject to view notes</h3>
          <p className="text-muted-foreground mt-2">Choose a subject from the dropdown above.</p>
        </div>
      )}
    </div>
  );
};

export default NotesTab;
