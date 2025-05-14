
import { useState } from 'react';
import { Subject } from '@/lib/interfaces/types';
import { useToast } from '@/components/ui/use-toast';

// Create a modified version that doesn't directly depend on AppContext
export const useSubjectManagement = (
  subjects: Subject[] = [],
  addSubject: (subject: Omit<Subject, 'id' | 'notes'>) => Subject = () => ({ id: '', name: '', semesterId: 1, notes: [] }),
  updateSubjects: (subjects: Subject[]) => void = () => {},
  users: any[] = [],
  semesterId?: number
) => {
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectSemester, setNewSubjectSemester] = useState<number>(semesterId || 1);
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [newSubjectTeacher, setNewSubjectTeacher] = useState<string>('');

  // Filter subjects by semester if semesterId is provided
  const filteredSubjects = semesterId 
    ? subjects.filter(s => s.semesterId === semesterId)
    : subjects;

  // Get all teachers
  const teachers = users.filter(user => user.role === 'teacher');

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    const newSubject = addSubject({
      name: newSubjectName,
      semesterId: newSubjectSemester,
      description: newSubjectDescription,
      teacherId: newSubjectTeacher || undefined
    });

    toast({
      title: "Success",
      description: `Subject "${newSubjectName}" has been added to Semester ${newSubjectSemester}`
    });

    // Reset form values
    resetFormValues();
    setIsAddDialogOpen(false);
  };

  const handleEditSubject = () => {
    if (!newSubjectName.trim() || !selectedSubject) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    const updatedSubjects = subjects.map(subject => {
      if (subject.id === selectedSubject) {
        return {
          ...subject,
          name: newSubjectName,
          semesterId: newSubjectSemester,
          description: newSubjectDescription,
          teacherId: newSubjectTeacher || undefined
        };
      }
      return subject;
    });

    updateSubjects(updatedSubjects);

    toast({
      title: "Success",
      description: `Subject has been updated`
    });

    // Reset form values
    resetFormValues();
    setIsEditDialogOpen(false);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm("Are you sure you want to delete this subject? This action cannot be undone.")) {
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
      updateSubjects(updatedSubjects);
      
      toast({
        title: "Success",
        description: "Subject has been deleted"
      });
    }
  };

  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject.id);
    setNewSubjectName(subject.name);
    setNewSubjectSemester(subject.semesterId);
    setNewSubjectDescription(subject.description || '');
    setNewSubjectTeacher(subject.teacherId || '');
    setIsEditDialogOpen(true);
  };

  const resetFormValues = () => {
    setNewSubjectName('');
    setNewSubjectDescription('');
    setNewSubjectTeacher('');
    if (semesterId) {
      setNewSubjectSemester(semesterId);
    }
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newSubjectName,
    setNewSubjectName,
    newSubjectSemester,
    setNewSubjectSemester,
    newSubjectDescription,
    setNewSubjectDescription,
    newSubjectTeacher,
    setNewSubjectTeacher,
    filteredSubjects,
    teachers,
    handleAddSubject,
    handleEditSubject,
    handleDeleteSubject,
    openEditDialog
  };
};
