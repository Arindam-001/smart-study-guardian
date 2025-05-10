
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, History, List, FileText } from 'lucide-react';
import { ResourceLevel } from '@/lib/interfaces/types';
import RecommendationsCard from '@/components/student/RecommendationsCard';
import HistoryCard from '@/components/student/HistoryCard';
import StudentDashboardHeader from '@/components/dashboard/StudentDashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import AssignmentsTab from '@/components/dashboard/AssignmentsTab';
import PerformanceTab from '@/components/dashboard/PerformanceTab';
import AttendanceTab from '@/components/dashboard/AttendanceTab';

const StudentDashboard = () => {
  const { user, subjects, getStudentPerformance } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].id);
    }
  }, [subjects, selectedSubject]);

  if (!user || user.role !== 'student') {
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

  const studentPerformances = getStudentPerformance(user.id);
  
  // Get all recommended resources across all performances
  const allRecommendations = studentPerformances
    .flatMap(p => p.recommendedResources || [])
    // Remove duplicates based on resource ID
    .filter((res, index, self) => 
      index === self.findIndex(r => r.id === res.id)
    );

  // Calculate overall performance statistics
  const totalAssignments = studentPerformances.length;
  const totalQuestions = studentPerformances.reduce(
    (sum, p) => sum + Object.values(p.topics).reduce((s, t) => s + t.total, 0), 
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
    subject => subject.semesterId === user.currentSemester
  );

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StudentDashboardHeader 
            user={user}
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
                    studentId={user.id}
                    subjects={subjects}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                    studentPerformances={studentPerformances}
                  />
                </TabsContent>
                
                <TabsContent value="assignments">
                  <AssignmentsTab 
                    currentSemesterSubjects={currentSemesterSubjects}
                    currentSemester={user.currentSemester}
                  />
                </TabsContent>
                
                <TabsContent value="performance">
                  <PerformanceTab 
                    studentPerformances={studentPerformances} 
                  />
                </TabsContent>
                
                <TabsContent value="attendance">
                  <AttendanceTab 
                    studentId={user.id}
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
          <RecommendationsCard resources={allRecommendations} studentLevel={studentLevel} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
