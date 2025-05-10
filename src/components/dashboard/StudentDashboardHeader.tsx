
import React from 'react';
import { User } from '@/lib/interfaces/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ResourceLevel } from '@/lib/interfaces/types';

interface StudentDashboardHeaderProps {
  user: User;
  totalAssignments: number;
  totalQuestions: number;
  totalCorrect: number;
  overallPercentage: number;
  studentLevel: ResourceLevel;
}

const StudentDashboardHeader: React.FC<StudentDashboardHeaderProps> = ({
  user,
  totalAssignments,
  totalQuestions,
  totalCorrect,
  overallPercentage,
  studentLevel
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div>Welcome, {user.name}</div>
          <div className="ml-auto">
            {studentLevel === 'beginner' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Beginner</span>
            )}
            {studentLevel === 'intermediate' && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Intermediate</span>
            )}
            {studentLevel === 'advanced' && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Advanced</span>
            )}
          </div>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>You are currently enrolled in Semester {user.currentSemester}</span>
          {totalAssignments > 0 && (
            <span className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              Overall: {totalCorrect}/{totalQuestions} ({overallPercentage}%)
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default StudentDashboardHeader;
