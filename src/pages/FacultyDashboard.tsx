
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getItem, setItem } from '@/lib/local-storage';

const FACULTY_STORAGE_KEY = 'FACULTY_DASHBOARD_STATE';

const FacultyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const impersonateId = searchParams.get('id');

  const { user, subjects, users, updateAttendance } = useAppContext();
  const { toast } = useToast();
  
  // Load state from localStorage or use defaults
  const savedState = getItem<{
    selectedSubject: string | null;
    activeTab: string;
  }>(FACULTY_STORAGE_KEY, {
    selectedSubject: null,
    activeTab: 'resources'
  });
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(savedState.selectedSubject);
  const [activeTab, setActiveTab] = useState<string>(savedState.activeTab);
  
  // Get the actual user - either the logged-in user or the impersonated user
  const actualUser = impersonateId && user?.role === 'admin' 
    ? users.find(u => u.id === impersonateId && u.role === 'teacher')
    : user;

  // Get subjects taught by this faculty member
  const taughtSubjects = subjects.filter(s => s.teacherId === actualUser?.id);
  
  // Get all students
  const students = users.filter(u => u.role === 'student');
  
  // Effect to set a default subject if none selected
  useEffect(() => {
    if (taughtSubjects.length > 0 && !selectedSubject) {
      const defaultSubject = taughtSubjects[0].id;
      setSelectedSubject(defaultSubject);
      
      // Save to localStorage
      setItem(FACULTY_STORAGE_KEY, {
        selectedSubject: defaultSubject,
        activeTab
      });
    }
  }, [taughtSubjects, selectedSubject, activeTab]);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    if (selectedSubject) {
      setItem(FACULTY_STORAGE_KEY, {
        selectedSubject,
        activeTab
      });
    }
  }, [selectedSubject, activeTab]);

  // Function to handle resource added notification
  const handleResourceAdded = () => {
    toast({
      title: "Resource Added",
      description: "Students can now access this resource",
    });
  };

  // Function to handle note added notification
  const handleNoteAdded = () => {
    toast({
      title: "Note Added",
      description: "Students can now access this note",
    });
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!actualUser || (actualUser.role !== 'teacher' && !impersonateId)) {
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
      {impersonateId && user?.role === 'admin' && (
        <Alert className="mb-6">
          <UserCheck className="h-4 w-4" />
          <AlertDescription>
            You are viewing the faculty dashboard as {actualUser.name}. This is in admin impersonation mode.
          </AlertDescription>
        </Alert>
      )}

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
            onSubjectChange={(subjectId) => {
              setSelectedSubject(subjectId);
            }}
          />

          {taughtSubjects.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-edu-dark">No subjects assigned</h3>
              <p className="text-muted-foreground mt-2">You don't have any subjects assigned to you yet.</p>
            </div>
          )}

          {selectedSubject && (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="resources">Manage Resources</TabsTrigger>
                <TabsTrigger value="notes">Manage Notes</TabsTrigger>
                <TabsTrigger value="attendance">Manage Attendance</TabsTrigger>
                <TabsTrigger value="view-attendance">View Attendance</TabsTrigger>
                <TabsTrigger value="students">View Students</TabsTrigger>
              </TabsList>

              <TabsContent value="resources">
                <ManageResourcesTab 
                  selectedSubject={selectedSubject} 
                  onResourceAdded={handleResourceAdded}
                />
              </TabsContent>

              <TabsContent value="notes">
                <ManageNotesTab 
                  notes={notes} 
                  selectedSubject={selectedSubject}
                  onNoteAdded={handleNoteAdded}
                />
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
