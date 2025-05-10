
import React from 'react';
import AttendanceCard from '@/components/student/AttendanceCard';
import { Subject } from '@/lib/interfaces/types';

interface AttendanceTabProps {
  studentId: string;
  subjects: Subject[];
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ studentId, subjects }) => {
  return (
    <div className="space-y-4">
      {subjects.map(subject => (
        <AttendanceCard 
          key={subject.id}
          studentId={studentId}
          subjectId={subject.id}
        />
      ))}
    </div>
  );
};

export default AttendanceTab;
