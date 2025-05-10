
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentPerformanceCard from '@/components/student/StudentPerformanceCard';
import AttendanceCard from '@/components/student/AttendanceCard';
import { Subject, StudentPerformance } from '@/lib/interfaces/types';

interface OverviewTabProps {
  studentId: string;
  subjects: Subject[];
  selectedSubject: string | null;
  setSelectedSubject: (value: string) => void;
  studentPerformances: StudentPerformance[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  studentId, 
  subjects, 
  selectedSubject, 
  setSelectedSubject,
  studentPerformances
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {studentPerformances.length > 0 ? (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Recent Performance</h3>
              <Select
                value={selectedSubject || ''}
                onValueChange={(value) => setSelectedSubject(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <StudentPerformanceCard 
              performance={studentPerformances[studentPerformances.length - 1]} 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Subject Attendance</h3>
            {selectedSubject && (
              <AttendanceCard 
                studentId={studentId} 
                subjectId={selectedSubject} 
              />
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p>Complete assignments to see your performance data.</p>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
