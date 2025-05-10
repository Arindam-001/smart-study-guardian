
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';
import { Calendar } from 'lucide-react';

interface AttendanceCardProps {
  studentId: string;
  subjectId: string;
}

const AttendanceCard = ({ studentId, subjectId }: AttendanceCardProps) => {
  const { user, subjects } = useAppContext();
  
  const subject = subjects.find(s => s.id === subjectId);
  const attendance = user?.attendance?.[subjectId] || [];
  
  const presentDays = attendance.filter(a => a).length;
  const totalDays = attendance.length;
  const attendancePercentage = totalDays > 0 
    ? Math.round((presentDays / totalDays) * 100) 
    : 0;
  
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Attendance</CardTitle>
        <Calendar className="h-5 w-5 text-edu-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">{subject?.name || 'Subject'}</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Present: {presentDays} / {totalDays} days</span>
              <span className="text-sm font-medium">
                {attendancePercentage}%
              </span>
            </div>
            
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  attendancePercentage >= 75 ? 'bg-green-500' : 
                  attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayStatus = attendance[i];
              return (
                <div 
                  key={i}
                  className={`h-6 w-6 flex items-center justify-center rounded-full text-xs ${
                    dayStatus === undefined ? 'bg-gray-100' :
                    dayStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
