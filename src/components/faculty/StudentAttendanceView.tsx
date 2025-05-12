
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, Check, X } from 'lucide-react';
import { useAppContext } from '@/lib/context';

interface StudentAttendanceViewProps {
  subjectId: string;
}

const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ subjectId }) => {
  const { users } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter students
  const students = users.filter(user => user.role === 'student');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Student Attendance</CardTitle>
        <Calendar className="h-5 w-5 text-edu-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <label htmlFor="attendance-date" className="text-sm font-medium">Date</label>
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
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overall Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => {
                const attendance = student.attendance?.[subjectId] || [];
                const dateIndex = parseInt(selectedDate.split('-')[2]) - 1;
                const isPresent = attendance[dateIndex];
                const presentDays = attendance.filter(a => a).length;
                const totalDays = attendance.length;
                const attendancePercentage = totalDays > 0 
                  ? Math.round((presentDays / totalDays) * 100) 
                  : 0;
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      {isPresent === undefined ? (
                        <span className="text-gray-500">Not Recorded</span>
                      ) : isPresent ? (
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-1 text-green-500" />
                          <span>Present</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="h-4 w-4 mr-1 text-red-500" />
                          <span>Absent</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          attendancePercentage >= 75 ? 'text-green-600' : 
                          attendancePercentage >= 60 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {attendancePercentage}%
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              attendancePercentage >= 75 ? 'bg-green-500' : 
                              attendancePercentage >= 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${attendancePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No students found for this subject
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceView;
