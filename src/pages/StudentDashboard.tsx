
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
import { BookOpen, Calendar, History, List, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResourceLevel } from '@/lib/context';

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

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div>Welcome, {user.name}</div>
                <div className="ml-auto">
                  {studentLevel === 'beginner' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Beginner</span>
                  )}
                  {studentLevel === 'intermediate' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Intermediate</span>
                  )}
                  {studentLevel === 'advanced' && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Advanced</span>
                  )}
                </div>
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>You are currently enrolled in Semester {user.currentSemester}</span>
                {totalAssignments > 0 && (
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    Overall: {totalCorrect}/{totalQuestions} ({overallPercentage}%)
                  </span>
                )}
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
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">Recent Performance</h3>
                            <Select
                              value={selectedSubject || ''}
                              onValueChange={(value) => setSelectedSubject(value)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
