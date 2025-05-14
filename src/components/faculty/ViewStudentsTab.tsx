
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/lib/interfaces/types';

interface ViewStudentsTabProps {
  students: User[];
}

const ViewStudentsTab: React.FC<ViewStudentsTabProps> = ({ students }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Semester</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length > 0 ? students.map(student => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.id}</TableCell>
            <TableCell>{student.currentSemester}</TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No students enrolled
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ViewStudentsTab;
