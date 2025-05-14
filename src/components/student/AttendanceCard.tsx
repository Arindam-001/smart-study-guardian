
import React from 'react';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface AttendanceCardProps {
  studentId: string;
  subjectId: string;
  subjectName?: string;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ studentId, subjectId, subjectName }) => {
  const { users, subjects } = useAppContext();
  
  // Get the student user
  const student = users.find(u => u.id === studentId);
  
  // Get subject name if not provided
  const subject = subjectName ? { name: subjectName } : subjects.find(s => s.id === subjectId);
  
  if (!student || !subject) return null;
  
  // Get attendance for this subject
  const attendance = student.attendance?.[subjectId] || [];
  
  // Calculate attendance percentage
  const totalDays = attendance.length;
  const presentDays = attendance.filter(present => present).length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{subject.name}</span>
          <span 
            className={`text-sm px-2 py-1 rounded ${
              attendancePercentage >= 75 ? 'bg-green-100 text-green-800' : 
              attendancePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}
          >
            {attendancePercentage}% Present
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalDays === 0 ? (
          <p className="text-muted-foreground text-center py-4">No attendance data available yet</p>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {attendance.map((present, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-2 rounded ${
                  present ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span className="text-xs text-gray-500">Day {index + 1}</span>
                {present ? (
                  <Check className="h-4 w-4 text-green-600 mt-1" />
                ) : (
                  <X className="h-4 w-4 text-red-600 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
