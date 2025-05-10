
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudentPerformance } from '@/lib/interfaces/types';

interface StudentPerformanceCardProps {
  performance: StudentPerformance;
}

const StudentPerformanceCard = ({ performance }: StudentPerformanceCardProps) => {
  const totalQuestions = Object.values(performance.topics)
    .reduce((sum, topic) => sum + topic.total, 0);
  
  const scorePercentage = Math.round((performance.score / totalQuestions) * 100);
  
  // Calculate topic performances
  const topicPerformances = Object.entries(performance.topics).map(([topic, data]) => ({
    topic,
    percentage: Math.round((data.correct / data.total) * 100),
    correct: data.correct,
    total: data.total
  }));
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-sm font-medium">{performance.score}/{totalQuestions} ({scorePercentage}%)</span>
          </div>
          <Progress value={scorePercentage} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Topic Performance</h4>
          {topicPerformances.map((tp) => (
            <div key={tp.topic} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs capitalize">{tp.topic}</span>
                <span className="text-xs">{tp.correct}/{tp.total} ({tp.percentage}%)</span>
              </div>
              <Progress value={tp.percentage} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPerformanceCard;
