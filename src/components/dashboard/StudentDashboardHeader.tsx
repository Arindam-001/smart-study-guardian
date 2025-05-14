import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, ResourceLevel } from '@/lib/interfaces/types';
import { BookOpen, Check } from 'lucide-react';

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
  const getLevelColor = (level: ResourceLevel) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-gray-500">Student ID: {user.id}</span>
              {user.enrolledCourse && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{user.enrolledCourse}</span>
                </>
              )}
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Semester {user.currentSemester}</span>
            </div>
          </div>
          
          <div className={`mt-4 md:mt-0 px-3 py-1 rounded-full text-sm border ${getLevelColor(studentLevel)}`}>
            {studentLevel.charAt(0).toUpperCase() + studentLevel.slice(1)} Level
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <div className="text-sm text-gray-500">Overall Performance</div>
            <div className="text-2xl font-bold mt-1">{overallPercentage}%</div>
            <div className="text-sm text-gray-600 mt-1">
              <Check className="w-4 h-4 inline mr-1 text-green-500" />
              <span>{totalCorrect}/{totalQuestions} correct answers</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <div className="text-sm text-gray-500">Assignments Completed</div>
            <div className="text-2xl font-bold mt-1">{totalAssignments}</div>
            <div className="text-sm text-gray-600 mt-1">Total assignments</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <div className="text-sm text-gray-500">Current Semester</div>
            <div className="text-2xl font-bold mt-1">{user.currentSemester}</div>
            <div className="text-sm text-gray-600 mt-1">
              <BookOpen className="w-4 h-4 inline mr-1" />
              <span>{user.accessibleSemesters.length} semesters access</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <div className="text-sm text-gray-500">Course</div>
            <div className="text-xl font-bold mt-1 truncate">
              {user.enrolledCourse || "Not specified"}
            </div>
            <div className="text-sm text-gray-600 mt-1">Enrolled program</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDashboardHeader;
