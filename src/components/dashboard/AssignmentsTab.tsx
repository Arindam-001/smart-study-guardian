
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subject } from '@/lib/interfaces/types';

interface AssignmentsTabProps {
  currentSemesterSubjects: Subject[];
  currentSemester: number;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  currentSemesterSubjects,
  currentSemester
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Your Assignments</h3>
      
      {currentSemesterSubjects.length > 0 ? (
        <div className="space-y-4">
          {currentSemesterSubjects.map(subject => (
            <Card key={subject.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription>Semester {currentSemester}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      No pending assignments for this subject.
                    </p>
                    <Link to={`/semester/${subject.semesterId}/subject/${subject.id}`}>
                      <Button variant="outline">View Subject Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No subjects available for your current semester.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;
