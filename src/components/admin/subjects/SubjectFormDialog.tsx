
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/interfaces/types';

interface SubjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subjectName: string;
  setSubjectName: (name: string) => void;
  subjectSemester: number;
  setSubjectSemester: (semester: number) => void;
  subjectDescription: string;
  setSubjectDescription: (description: string) => void;
  subjectTeacher: string;
  setSubjectTeacher: (teacherId: string) => void;
  onSubmit: () => void;
  teachers: User[];
  submitButtonText: string;
}

const SubjectFormDialog: React.FC<SubjectFormDialogProps> = ({
  isOpen,
  onClose,
  title,
  subjectName,
  setSubjectName,
  subjectSemester,
  setSubjectSemester,
  subjectDescription,
  setSubjectDescription,
  subjectTeacher,
  setSubjectTeacher,
  onSubmit,
  teachers,
  submitButtonText
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input 
              id="subject-name"
              placeholder="Enter subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject-semester">Semester</Label>
            <Select 
              value={String(subjectSemester)} 
              onValueChange={(value) => setSubjectSemester(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                  <SelectItem key={semester} value={String(semester)}>
                    Semester {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject-description">Description (Optional)</Label>
            <Textarea 
              id="subject-description"
              placeholder="Enter subject description"
              value={subjectDescription}
              onChange={(e) => setSubjectDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject-teacher">Assign Teacher (Optional)</Label>
            <Select 
              value={subjectTeacher} 
              onValueChange={setSubjectTeacher}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name || `Teacher ${teacher.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectFormDialog;
