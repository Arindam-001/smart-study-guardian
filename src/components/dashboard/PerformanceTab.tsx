
import React from 'react';
import StudentPerformanceCard from '@/components/student/StudentPerformanceCard';
import { StudentPerformance } from '@/lib/interfaces/types';

interface PerformanceTabProps {
  studentPerformances: StudentPerformance[];
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ studentPerformances }) => {
  return (
    <div className="space-y-4">
      {studentPerformances.length > 0 ? (
        studentPerformances.map(performance => (
          <StudentPerformanceCard 
            key={performance.assignmentId}
            performance={performance} 
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p>No performance data available. Complete assignments to see your results.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceTab;
