
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-edu-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-edu-dark">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="bg-edu-primary"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
