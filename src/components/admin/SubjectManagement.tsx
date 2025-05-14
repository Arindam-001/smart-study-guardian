
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubjectsTable from './subjects/SubjectsTable';
import SubjectFormDialog from './subjects/SubjectFormDialog';
import { useSubjectManagement } from '@/hooks/useSubjectManagement';

interface SubjectManagementProps {
  semesterId?: number;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ semesterId }) => {
  const {
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
  } = useSubjectManagement(semesterId);

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

      <SubjectsTable 
        subjects={filteredSubjects}
        users={teachers}
        onEditSubject={openEditDialog}
        onDeleteSubject={handleDeleteSubject}
      />

      {/* Add Subject Dialog */}
      <SubjectFormDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add New Subject"
        subjectName={newSubjectName}
        setSubjectName={setNewSubjectName}
        subjectSemester={newSubjectSemester}
        setSubjectSemester={setNewSubjectSemester}
        subjectDescription={newSubjectDescription}
        setSubjectDescription={setNewSubjectDescription}
        subjectTeacher={newSubjectTeacher}
        setSubjectTeacher={setNewSubjectTeacher}
        onSubmit={handleAddSubject}
        teachers={teachers}
        submitButtonText="Add Subject"
      />

      {/* Edit Subject Dialog */}
      <SubjectFormDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Subject"
        subjectName={newSubjectName}
        setSubjectName={setNewSubjectName}
        subjectSemester={newSubjectSemester}
        setSubjectSemester={setNewSubjectSemester}
        subjectDescription={newSubjectDescription}
        setSubjectDescription={setNewSubjectDescription}
        subjectTeacher={newSubjectTeacher}
        setSubjectTeacher={setNewSubjectTeacher}
        onSubmit={handleEditSubject}
        teachers={teachers}
        submitButtonText="Save Changes"
      />
    </div>
  );
};

export default SubjectManagement;
