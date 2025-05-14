
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentAttendanceView from '@/components/faculty/StudentAttendanceView';
import SubjectSelector from '@/components/faculty/SubjectSelector';
import ManageResourcesTab from '@/components/faculty/ManageResourcesTab';
import ManageNotesTab from '@/components/faculty/ManageNotesTab';
import ManageAttendanceTab from '@/components/faculty/ManageAttendanceTab';
import ViewStudentsTab from '@/components/faculty/ViewStudentsTab';

const FacultyDashboard = () => {
  const { user, subjects, users, updateAttendance } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Get subjects taught by this faculty member
  const taughtSubjects = subjects.filter(s => s.teacherId === user?.id);
  
  // Get all students
  const students = users.filter(u => u.role === 'student');
  
  // Effect to set a default subject if none selected
  useEffect(() => {
    if (taughtSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(taughtSubjects[0].id);
    }
  }, [subjects, taughtSubjects, selectedSubject]);

  if (!user || user.role !== 'teacher') {
    return (
      <DashboardLayout title="Faculty Dashboard">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
              <p className="mt-2">You do not have access to the faculty dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const notes = currentSubject?.notes || [];

  return (
    <DashboardLayout title="Faculty Dashboard">
      <Card>
        <CardHeader>
          <CardTitle>
            Subject: {
              selectedSubject 
                ? subjects.find(s => s.id === selectedSubject)?.name 
                : 'Select a Subject'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubjectSelector
            subjects={taughtSubjects}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
          />

          {taughtSubjects.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-edu-dark">No subjects assigned</h3>
              <p className="text-muted-foreground mt-2">You don't have any subjects assigned to you yet.</p>
            </div>
          )}

          {selectedSubject && (
            <Tabs defaultValue="resources">
              <TabsList className="mb-6">
                <TabsTrigger value="resources">Manage Resources</TabsTrigger>
                <TabsTrigger value="notes">Manage Notes</TabsTrigger>
                <TabsTrigger value="attendance">Manage Attendance</TabsTrigger>
                <TabsTrigger value="view-attendance">View Attendance</TabsTrigger>
                <TabsTrigger value="students">View Students</TabsTrigger>
              </TabsList>

              <TabsContent value="resources">
                <ManageResourcesTab selectedSubject={selectedSubject} />
              </TabsContent>

              <TabsContent value="notes">
                <ManageNotesTab notes={notes} />
              </TabsContent>

              <TabsContent value="attendance">
                <ManageAttendanceTab 
                  students={students} 
                  updateAttendance={updateAttendance} 
                  selectedSubject={selectedSubject}
                />
              </TabsContent>

              <TabsContent value="view-attendance">
                <StudentAttendanceView subjectId={selectedSubject} />
              </TabsContent>

              <TabsContent value="students">
                <ViewStudentsTab students={students} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
