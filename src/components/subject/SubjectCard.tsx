
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Subject } from '@/lib/interfaces/types';

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const navigate = useNavigate();
  const { id, name, semesterId, notes } = subject;
  const noteCount = notes.length;
  
  const handleClick = () => {
    navigate(`/semester/${semesterId}/subject/${id}`);
  };

  return (
    <Card 
      className="transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-edu-primary flex items-center gap-2">
          <BookOpen size={20} />
          {name}
        </CardTitle>
        <CardDescription>
          Semester {semesterId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {noteCount > 0 
            ? `${noteCount} lecture note${noteCount > 1 ? 's' : ''} available` 
            : 'No lecture notes available yet'}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="bg-edu-primary"
        >
          View Subject
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
