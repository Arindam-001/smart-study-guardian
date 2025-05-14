
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield } from 'lucide-react';

interface QuickAssignmentCardProps {
  onCreateClick: () => void;
}

const QuickAssignmentCard: React.FC<QuickAssignmentCardProps> = ({
  onCreateClick,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-edu-primary">
          <Shield className="h-5 w-5" />
          Quick Assignment Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Generate a new assignment with AI-created questions based on your notes materials.
        </p>
        <Button 
          onClick={onCreateClick} 
          className="w-full bg-edu-primary"
        >
          <FileText className="mr-2 h-4 w-4" />
          Create New Assignment
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAssignmentCard;
