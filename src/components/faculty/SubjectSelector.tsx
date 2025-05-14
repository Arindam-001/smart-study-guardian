
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject } from '@/lib/interfaces/types';

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: string | null;
  onSubjectChange: (subjectId: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ subjects, selectedSubject, onSubjectChange }) => {
  return (
    <div className="mb-6">
      <Label htmlFor="subject-select">Select Subject</Label>
      <Select 
        value={selectedSubject || ''} 
        onValueChange={onSubjectChange}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map(subject => (
            <SelectItem key={subject.id} value={subject.id || `subject-${Date.now()}`}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubjectSelector;
