
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment, StudentPerformance } from '@/lib/interfaces/types';
import { History } from 'lucide-react';

interface HistoryCardProps {
  performances: StudentPerformance[];
  assignments: Assignment[];
}

const HistoryCard = ({ performances, assignments }: HistoryCardProps) => {
  const completedAssignments = performances.map(performance => {
    const assignment = assignments.find(a => a.id === performance.assignmentId);
    return {
      ...performance,
      assignmentTitle: assignment?.title || 'Unknown Assignment',
      completedAt: new Date(),
      totalQuestions: Object.values(performance.topics)
        .reduce((sum, topic) => sum + topic.total, 0)
    };
  });
  
  // Sort by completion date (most recent first)
  completedAssignments.sort((a, b) => 
    b.completedAt.getTime() - a.completedAt.getTime()
  );

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Learning History</CardTitle>
        <History className="h-5 w-5 text-edu-primary" />
      </CardHeader>
      <CardContent>
        {completedAssignments.length === 0 ? (
          <p className="text-sm text-gray-500">No learning history available yet. Complete assignments to build your history.</p>
        ) : (
          <ul className="divide-y">
            {completedAssignments.map((item, index) => (
              <li key={`${item.assignmentId}-${index}`} className="py-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">{item.assignmentTitle}</h4>
                  <span className="text-xs text-gray-500">
                    {item.completedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Score: {item.score}/{item.totalQuestions}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    (item.score / item.totalQuestions) >= 0.75 ? 'bg-green-100 text-green-800' : 
                    (item.score / item.totalQuestions) >= 0.5 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {(item.score / item.totalQuestions) >= 0.75 ? 'Excellent' : 
                    (item.score / item.totalQuestions) >= 0.5 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
