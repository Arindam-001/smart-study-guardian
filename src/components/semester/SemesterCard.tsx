
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';
import { useAppContext } from '@/lib/context';

interface SemesterCardProps {
  semesterId: number;
  isAccessible: boolean;
}

const SemesterCard = ({ semesterId, isAccessible }: SemesterCardProps) => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const handleClick = () => {
    if (isAccessible) {
      navigate(`/semester/${semesterId}`);
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${
        isAccessible 
          ? 'hover:shadow-lg cursor-pointer bg-white' 
          : 'bg-gray-100 opacity-75'
      }`}
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2">
        {isAccessible ? (
          <Unlock className="text-edu-success" size={20} />
        ) : (
          <Lock className="text-edu-danger" size={20} />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-edu-primary">Semester {semesterId}</CardTitle>
        <CardDescription>
          {isAccessible 
            ? 'Click to view subjects and materials' 
            : 'Access locked - Contact administrator'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {isAccessible 
            ? 'Access course materials, assignments and lectures for this semester.' 
            : 'You do not have access to this semester yet.'}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isAccessible ? "default" : "outline"} 
          className={isAccessible ? "bg-edu-primary" : "bg-muted"} 
          disabled={!isAccessible}
        >
          {isAccessible ? 'Enter Semester' : 'Locked'}
        </Button>
      </CardFooter>
      {!isAccessible && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-20 flex items-center justify-center">
          {user && user.role === 'admin' && (
            <Button variant="secondary">Grant Access</Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default SemesterCard;
