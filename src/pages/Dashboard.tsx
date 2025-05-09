
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SemesterCard from '@/components/semester/SemesterCard';
import { useAppContext } from '@/lib/context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { User, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user, semesters, warnings } = useAppContext();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-edu-primary">Not Authenticated</h1>
          <p className="mt-2">Please log in to access the dashboard</p>
          <a href="/" className="mt-4 inline-block text-edu-accent underline">Go to Login</a>
        </div>
      </div>
    );
  }

  const isAccessible = (semesterId: number) => {
    if (user.role === 'admin' || user.role === 'teacher') {
      return true;
    }
    return user.accessibleSemesters.includes(semesterId);
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <User className="mr-2" size={20} />
              Welcome, {user.name}
            </h2>
            <p className="text-muted-foreground">
              {user.role === 'student' 
                ? `You are currently enrolled in Semester ${user.currentSemester}.` 
                : `You are logged in as a ${user.role === 'admin' ? 'Head of Department' : 'Teacher'}.`}
            </p>
          </div>
          
          {warnings.length > 0 && user.role !== 'student' && (
            <Alert variant="destructive" className="w-80">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention Required</AlertTitle>
              <AlertDescription>
                {warnings.length} cheating attempt{warnings.length !== 1 ? 's' : ''} detected in assignments.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Semesters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {semesters.map((semesterId) => (
          <SemesterCard 
            key={semesterId} 
            semesterId={semesterId} 
            isAccessible={isAccessible(semesterId)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
