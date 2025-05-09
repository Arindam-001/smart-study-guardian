
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubjectCard from '@/components/subject/SubjectCard';
import { useAppContext } from '@/lib/context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SemesterView = () => {
  const { semesterId } = useParams<{ semesterId: string }>();
  const navigate = useNavigate();
  const { user, subjects } = useAppContext();
  
  if (!user) {
    navigate('/');
    return null;
  }

  const isAccessible = (sid: number) => {
    if (user.role === 'admin' || user.role === 'teacher') {
      return true;
    }
    return user.accessibleSemesters.includes(sid);
  };

  // Parse semesterId as number
  const currentSemesterId = parseInt(semesterId || '1');
  
  if (!isAccessible(currentSemesterId)) {
    return (
      <DashboardLayout title={`Semester ${semesterId}`}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have access to this semester. Please contact your administrator.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  // Filter subjects by semester
  const semesterSubjects = subjects.filter(subject => subject.semesterId === currentSemesterId);

  return (
    <DashboardLayout title={`Semester ${semesterId}`}>
      {semesterSubjects.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-edu-dark">No subjects available for this semester yet.</h3>
          {user.role !== 'student' && (
            <p className="text-muted-foreground mt-2">As an instructor, you can add subjects to this semester.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semesterSubjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              id={subject.id} 
              name={subject.name} 
              semesterId={subject.semesterId} 
              noteCount={subject.notes.length}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SemesterView;
