
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StudentPerformanceCard from '@/components/student/StudentPerformanceCard';
import RecommendationsCard from '@/components/student/RecommendationsCard';
import AttendanceCard from '@/components/student/AttendanceCard';
import HistoryCard from '@/components/student/HistoryCard';
import { BookOpen, Calendar, History, List } from 'lucide-react';

const StudentDashboard = () => {
  const { user, subjects, getStudentPerformance } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Welcome, {user.name}</CardTitle>
              <CardDescription>
                You are currently enrolled in Semester {user.currentSemester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>Overview</span>
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
                  <div className="grid grid-cols-1 gap-4">
                    {studentPerformances.length > 0 ? (
                      <>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Recent Performance</h3>
                          <StudentPerformanceCard 
                            performance={studentPerformances[studentPerformances.length - 1]} 
                          />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Subject Attendance</h3>
                          {selectedSubject && (
                            <AttendanceCard 
                              studentId={user.id} 
                              subjectId={selectedSubject} 
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p>Complete assignments to see your performance data.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="performance">
                  <div className="space-y-4">
                    {studentPerformances.length > 0 ? (
                      studentPerformances.map(performance => (
                        <StudentPerformanceCard 
                          key={performance.assignmentId}
                          performance={performance} 
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p>No performance data available. Complete assignments to see your results.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="attendance">
                  <div className="space-y-4">
                    {subjects.map(subject => (
                      <AttendanceCard 
                        key={subject.id}
                        studentId={user.id}
                        subjectId={subject.id}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <HistoryCard 
                    performances={studentPerformances}
                    assignments={subjects.flatMap(s => s.assignments || [])}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <RecommendationsCard resources={allRecommendations} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
