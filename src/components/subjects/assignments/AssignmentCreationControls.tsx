
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Subject } from '@/lib/interfaces/types';
import { AlertTriangle } from 'lucide-react';
import QuickAssignmentGenerator from '@/components/faculty/QuickAssignmentGenerator';

interface AssignmentCreationControlsProps {
  subject: Subject;
  hasWarnings: boolean;
  onCreateClick: () => void;
}

const AssignmentCreationControls: React.FC<AssignmentCreationControlsProps> = ({
  subject,
  hasWarnings,
  onCreateClick
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <QuickAssignmentGenerator 
        subjectId={subject.id} 
        onAssignmentCreated={onCreateClick}
      />
      
      <Button 
        variant="outline" 
        className="h-auto py-6 flex flex-col items-center gap-2"
        onClick={() => navigate('/notifications')}
      >
        <AlertTriangle size={24} className={hasWarnings ? "text-red-500" : ""} />
        <span className="font-medium">View Warnings</span>
        <span className="text-xs">{hasWarnings ? "Student violations detected!" : "No violations detected"}</span>
      </Button>
    </div>
  );
};

export default AssignmentCreationControls;
