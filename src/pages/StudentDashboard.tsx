import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, History, List, FileText } from 'lucide-react';
import { ResourceLevel, Resource } from '@/lib/interfaces/types';
import RecommendationsCard from '@/components/student/RecommendationsCard';
import HistoryCard from '@/components/student/HistoryCard';
import StudentDashboardHeader from '@/components/dashboard/StudentDashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import AssignmentsTab from '@/components/dashboard/AssignmentsTab';
import PerformanceTab from '@/components/dashboard/PerformanceTab';
import AttendanceTab from '@/components/dashboard/AttendanceTab';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck } from 'lucide-react';

const StudentDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const impersonateId = searchParams.get('id');

  const { user, users, subjects, getStudentPerformance } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showAllResources, setShowAllResources] = useState(false);
  
  // Get the actual user - either the logged-in user or the impersonated user
  const actualUser = impersonateId && user?.role === 'admin' 
    ? users.find(u => u.id === impersonateId && u.role === 'student')
    : user;
  
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject && actualUser) {
      const userSubjects = subjects.filter(s => actualUser.accessibleSemesters.includes(s.semesterId));
      if (userSubjects.length > 0) {
        setSelectedSubject(userSubjects[0].id);
      }
    }
  }, [subjects, selectedSubject, actualUser]);

  if (!actualUser || (actualUser.role !== 'student' && !impersonateId)) {
    return (
      <DashboardLayout title="Student Dashboard">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
              <p className="mt-2">You do not have access to the student dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const studentPerformances = getStudentPerformance(actualUser.id);
  
  // Get all recommended resources across all performances
  const allRecommendations = studentPerformances
    .flatMap(p => p.recommendedResources || [])
    // Remove duplicates based on resource ID
    .filter((res, index, self) => 
      index === self.findIndex(r => r.id === res.id)
    );

  // Get all resources from the student's current semester subjects
  const allResources: Resource[] = subjects
    .filter(subject => actualUser.accessibleSemesters.includes(subject.semesterId))
    .flatMap(subject => subject.resources || [])
    .filter((res, index, self) => 
      index === self.findIndex(r => r.id === res.id)
    );

  // Calculate overall performance statistics
  const totalAssignments = studentPerformances.length;
  const totalQuestions = studentPerformances.reduce(
    (sum, p) => sum + Object.values(p.topics).reduce((s, t) => s + (t.total || 0), 0), 
    0
  );
  const totalCorrect = studentPerformances.reduce(
    (sum, p) => sum + p.score, 
    0
  );
  
  const overallPercentage = totalQuestions > 0 
    ? Math.round((totalCorrect / totalQuestions) * 100) 
    : 0;

  // Determine student level
  let studentLevel: ResourceLevel = 'beginner';
  if (overallPercentage >= 75) {
    studentLevel = 'advanced';
  } else if (overallPercentage >= 50) {
    studentLevel = 'intermediate';
  }

  // Filter subjects for the current semester
  const currentSemesterSubjects = subjects.filter(
    subject => subject.semesterId === actualUser.currentSemester
  );

  return (
    <DashboardLayout title="Student Dashboard">
      {impersonateId && user?.role === 'admin' && (
        <Alert className="mb-6">
          <UserCheck className="h-4 w-4" />
          <AlertDescription>
            You are viewing the student dashboard as {actualUser.name}. This is in admin impersonation mode.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StudentDashboardHeader 
            user={actualUser}
            totalAssignments={totalAssignments}
            totalQuestions={totalQuestions}
            totalCorrect={totalCorrect}
            overallPercentage={overallPercentage}
            studentLevel={studentLevel}
          />
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Assignments</span>
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Performance</span>
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Attendance</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <OverviewTab 
                    studentId={actualUser.id}
                    subjects={subjects}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                    studentPerformances={studentPerformances}
                  />
                </TabsContent>
                
                <TabsContent value="assignments">
                  <AssignmentsTab 
                    currentSemesterSubjects={currentSemesterSubjects}
                    currentSemester={actualUser.currentSemester}
                  />
                </TabsContent>
                
                <TabsContent value="performance">
                  <div className="space-y-8">
                    <PerformanceTab 
                      studentPerformances={studentPerformances} 
                    />
                    
                    {/* Move recommendations into performance tab */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personalized Recommendations</h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch 
                          id="resource-mode" 
                          checked={showAllResources} 
                          onCheckedChange={setShowAllResources}
                        />
                        <Label htmlFor="resource-mode">
                          {showAllResources ? "Show All Resources" : "Show Recommendations"}
                        </Label>
                      </div>
                      
                      <RecommendationsCard 
                        resources={allRecommendations} 
                        studentLevel={studentLevel} 
                        allResources={allResources}
                        showAllResources={showAllResources}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="attendance">
                  <AttendanceTab 
                    studentId={actualUser.id}
                    subjects={subjects}
                  />
                </TabsContent>
                
                <TabsContent value="history">
                  <HistoryCard 
                    performances={studentPerformances}
                    assignments={[]} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Accessibility info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Semester Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">Current Semester: {actualUser.currentSemester}</div>
                <div className="text-sm text-muted-foreground">You have access to the following semesters:</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                    <div 
                      key={semester}
                      className={`px-3 py-1 rounded-full text-sm ${
                        actualUser.accessibleSemesters.includes(semester)
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      Semester {semester}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
