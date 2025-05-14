
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash } from 'lucide-react';
import { User, Subject } from '@/lib/interfaces/types';

interface SubjectsTableProps {
  subjects: Subject[];
  users: User[];
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

const SubjectsTable: React.FC<SubjectsTableProps> = ({
  subjects,
  users,
  onEditSubject,
  onDeleteSubject
}) => {
  return (
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
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <TableRow key={subject.id}>
              <TableCell className="font-medium">{subject.name}</TableCell>
              <TableCell>Semester {subject.semesterId}</TableCell>
              <TableCell>
                {subject.teacherId && users.find(u => u.id === subject.teacherId)?.name || 'Unassigned'}
              </TableCell>
              <TableCell>{subject.resources?.length || 0} resources</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEditSubject(subject)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDeleteSubject(subject.id)}>
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
  );
};

export default SubjectsTable;
