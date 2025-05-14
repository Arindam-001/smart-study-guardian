
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface SubjectNotFoundProps {
  semesterId?: string;
}

const SubjectNotFound: React.FC<SubjectNotFoundProps> = ({ semesterId }) => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout title="Subject Not Found">
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-edu-dark">Subject not found</h3>
        <Button 
          onClick={() => navigate(`/semester/${semesterId}`)} 
          className="mt-4"
          variant="outline"
        >
          Go Back to Semester
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default SubjectNotFound;
