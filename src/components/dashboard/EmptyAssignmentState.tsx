
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyAssignmentStateProps {
  subjectId: string;
  semesterId: number;
}

const EmptyAssignmentState: React.FC<EmptyAssignmentStateProps> = ({ 
  subjectId,
  semesterId 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-4">
      <p className="text-muted-foreground mb-4">
        No pending assignments for this subject.
      </p>
      <Button 
        variant="outline" 
        onClick={() => navigate(`/semester/${semesterId}/subject/${subjectId}`, { replace: true })}
      >
        View Subject Details
      </Button>
    </div>
  );
};

export default EmptyAssignmentState;
