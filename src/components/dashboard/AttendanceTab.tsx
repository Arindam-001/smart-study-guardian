
import React from 'react';
import AttendanceCard from '@/components/student/AttendanceCard';
import { Subject, User } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';

interface AttendanceTabProps {
  studentId: string;
  subjects: Subject[];
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ studentId, subjects }) => {
  const { user, users } = useAppContext();
  
  // Get the current student user (could be the logged-in user or another student being viewed)
  const currentStudent = user?.id === studentId ? user : users.find(u => u.id === studentId);
  
  // Filter subjects that are in the student's accessible semesters
  const accessibleSubjects = subjects.filter(subject => 
    currentStudent?.accessibleSemesters.includes(subject.semesterId)
  );

  // If no subjects are available, show a message
  if (accessibleSubjects.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No subjects available</h3>
        <p className="text-sm text-gray-500 mt-2">
          No subjects have been assigned for your semesters.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {accessibleSubjects.map(subject => (
        <AttendanceCard 
          key={subject.id}
          studentId={studentId}
          subjectId={subject.id}
          subjectName={subject.name}
        />
      ))}
    </div>
  );
};

export default AttendanceTab;
