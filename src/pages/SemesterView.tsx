
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubjectCard from '@/components/subject/SubjectCard';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SubjectManagement from '@/components/admin/SubjectManagement';

const SemesterView = () => {
  const { semesterId } = useParams<{ semesterId: string }>();
  const { user, subjects } = useAppContext();
  
  if (!semesterId || !user) {
    return (
      <DashboardLayout title="Semester Not Found">
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-edu-dark">Semester ID is missing</h3>
          <Button 
            asChild
            variant="outline" 
            className="mt-4"
          >
            <Link to="/dashboard">Go Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const numericSemesterId = Number(semesterId);
  
  // Check if user has access to this semester
  const hasAccess = 
    user.role === 'admin' || 
    user.role === 'teacher' || 
    user.accessibleSemesters.includes(numericSemesterId);
  
  // Get subjects for this semester
  const semesterSubjects = subjects.filter(s => s.semesterId === numericSemesterId);

  // For students, filter accessible subjects
  const accessibleSubjects = user.role === 'student' 
    ? semesterSubjects
    : semesterSubjects;
  
  const isAdminOrTeacher = user.role === 'admin' || user.role === 'teacher';

  return (
    <DashboardLayout title={`Semester ${semesterId}`}>
      <Button 
        asChild
        variant="outline" 
        className="mb-6"
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      
      {!hasAccess ? (
        <div className="text-center py-8 border rounded-lg bg-red-50">
          <h3 className="text-xl font-medium text-red-500">Access Denied</h3>
          <p className="text-muted-foreground mt-2">
            You do not have access to Semester {semesterId}.
          </p>
        </div>
      ) : (
        <>
          {isAdminOrTeacher && (
            <div className="mb-8">
              <SubjectManagement semesterId={numericSemesterId} />
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-6">Available Subjects</h2>
          
          {accessibleSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {accessibleSubjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-edu-dark">No subjects available</h3>
              {isAdminOrTeacher && (
                <p className="text-muted-foreground mt-2">
                  Use the subject management panel above to add subjects to this semester.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default SemesterView;
