
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { User } from '@/lib/interfaces/types';
import { useToast } from '@/hooks/use-toast';

interface ManageAttendanceTabProps {
  students: User[];
  updateAttendance: (studentId: string, subjectId: string, date: string, present: boolean) => void;
  selectedSubject: string | null;
}

const ManageAttendanceTab: React.FC<ManageAttendanceTabProps> = ({ students, updateAttendance, selectedSubject }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    if (!selectedSubject) return;
    
    updateAttendance(studentId, selectedSubject, selectedDate, isPresent);
    
    toast({
      title: "Attendance Updated",
      description: `Attendance for student ${studentId} marked as ${isPresent ? 'present' : 'absent'}`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="attendance-date">Date</Label>
          <Input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? students.map(student => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-20"
                    onClick={() => handleAttendanceChange(student.id, true)}
                  >
                    <Check className="h-4 w-4 mr-1 text-green-500" /> Present
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-20"
                    onClick={() => handleAttendanceChange(student.id, false)}
                  >
                    <X className="h-4 w-4 mr-1 text-red-500" /> Absent
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No students enrolled
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageAttendanceTab;
