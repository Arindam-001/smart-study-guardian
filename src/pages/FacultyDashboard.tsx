
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { useFacultyDashboard } from '@/hooks/useFacultyDashboard';
import AccessDeniedCard from '@/components/faculty/AccessDeniedCard';
import ImpersonationAlert from '@/components/faculty/ImpersonationAlert';
import FacultyDashboardContainer from '@/components/faculty/FacultyDashboardContainer';

const FacultyDashboard = () => {
  const { updateAttendance } = useAppContext();
  
  const {
    actualUser,
    impersonateId,
    user,
    taughtSubjects,
    selectedSubject,
    setSelectedSubject,
    activeTab,
    handleTabChange,
    students,
    currentSubject,
    notes,
    handleResourceAdded,
    handleNoteAdded,
    handleAssignmentAdded
  } = useFacultyDashboard();

  if (!actualUser || (actualUser.role !== 'teacher' && !impersonateId)) {
    return (
      <DashboardLayout title="Faculty Dashboard">
        <AccessDeniedCard />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Faculty Dashboard">
      <ImpersonationAlert 
        isImpersonating={!!impersonateId && user?.role === 'admin'} 
        actualUser={actualUser} 
        adminUser={user}
      />

      <FacultyDashboardContainer
        subjects={currentSubject ? [currentSubject] : []}
        taughtSubjects={taughtSubjects}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        students={students}
        notes={notes}
        onResourceAdded={handleResourceAdded}
        onNoteAdded={handleNoteAdded}
        onAssignmentAdded={handleAssignmentAdded}
        updateAttendance={updateAttendance}
      />
    </DashboardLayout>
  );
};

export default FacultyDashboard;
