
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash } from 'lucide-react';

interface SubjectManagementProps {
  semesterId?: number;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ semesterId }) => {
  const { subjects, addSubject, updateSubjects, users } = useAppContext();
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
  const teachers = users.filter(u => u.role === 'teacher');

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
    setNewSubjectName('');
    setNewSubjectDescription('');
    setNewSubjectTeacher('');
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
    setNewSubjectName('');
    setNewSubjectDescription('');
    setNewSubjectTeacher('');
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

  const openEditDialog = (subject: any) => {
    setSelectedSubject(subject.id);
    setNewSubjectName(subject.name);
    setNewSubjectSemester(subject.semesterId);
    setNewSubjectDescription(subject.description || '');
    setNewSubjectTeacher(subject.teacherId || '');
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {semesterId ? `Semester ${semesterId} Subjects` : 'All Subjects'}
        </h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Resources</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell>Semester {subject.semesterId}</TableCell>
                <TableCell>
                  {users.find(u => u.id === subject.teacherId)?.name || 'Unassigned'}
                </TableCell>
                <TableCell>{subject.resources?.length || 0} resources</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(subject)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No subjects found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Subject Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input 
                id="subject-name"
                placeholder="Enter subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject-semester">Semester</Label>
              <Select 
                value={String(newSubjectSemester)} 
                onValueChange={(value) => setNewSubjectSemester(Number(value))}
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
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject-teacher">Assign Teacher (Optional)</Label>
              <Select 
                value={newSubjectTeacher} 
                onValueChange={setNewSubjectTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubject}>
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject-name">Subject Name</Label>
              <Input 
                id="edit-subject-name"
                placeholder="Enter subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-subject-semester">Semester</Label>
              <Select 
                value={String(newSubjectSemester)} 
                onValueChange={(value) => setNewSubjectSemester(Number(value))}
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
              <Label htmlFor="edit-subject-description">Description (Optional)</Label>
              <Textarea 
                id="edit-subject-description"
                placeholder="Enter subject description"
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-subject-teacher">Assign Teacher (Optional)</Label>
              <Select 
                value={newSubjectTeacher} 
                onValueChange={setNewSubjectTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubject}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectManagement;
