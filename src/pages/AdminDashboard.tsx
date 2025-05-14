
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, UserCheck, BookOpen, AlertTriangle, ShieldAlert, User, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user, users, subjects, warnings, semesters, grantSemesterAccess } = useAppContext();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const { toast } = useToast();
  
  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout title="Admin Dashboard">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
              <p className="mt-2">You do not have access to the admin dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const handleGrantAccess = () => {
    if (!selectedStudent || !selectedSemester) {
      toast({
        title: "Error",
        description: "Please select both a student and semester",
        variant: "destructive"
      });
      return;
    }
    
    grantSemesterAccess(selectedStudent, selectedSemester);
    
    toast({
      title: "Access Granted",
      description: `Student has been granted access to Semester ${selectedSemester}`
    });
  };

  const handleAssignTeacher = () => {
    if (!selectedSubject || !selectedTeacher) {
      toast({
        title: "Error",
        description: "Please select both a subject and a teacher",
        variant: "destructive"
      });
      return;
    }

    // Find the subject and update its teacherId
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === selectedSubject) {
        return { ...subject, teacherId: selectedTeacher };
      }
      return subject;
    });

    // Update the subjects in the context
    const { updateSubjects } = useAppContext();
    updateSubjects(updatedSubjects);
    
    toast({
      title: "Teacher Assigned",
      description: `Teacher has been assigned to the selected subject`
    });
  };

  const handleUnassignTeacher = (subjectId: string) => {
    // Find the subject and update its teacherId to empty string
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return { ...subject, teacherId: "" };
      }
      return subject;
    });

    // Update the subjects in the context
    const { updateSubjects } = useAppContext();
    updateSubjects(updatedSubjects);
    
    toast({
      title: "Teacher Unassigned",
      description: `Teacher has been unassigned from the subject`
    });
  };

  const studentUsers = users.filter(u => u.role === 'student');
  const facultyUsers = users.filter(u => u.role === 'teacher');

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                <span>Admin Control Panel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="students">
                <TabsList className="mb-6">
                  <TabsTrigger value="students" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Students</span>
                  </TabsTrigger>
                  <TabsTrigger value="faculty" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Faculty</span>
                  </TabsTrigger>
                  <TabsTrigger value="subjects" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Subjects</span>
                  </TabsTrigger>
                  <TabsTrigger value="warnings" className="flex items-center gap-2 relative">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Warnings</span>
                    {warnings.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                        {warnings.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="students">
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Current Semester</TableHead>
                          <TableHead>Accessible Semesters</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentUsers.map(student => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.currentSemester}</TableCell>
                            <TableCell>
                              {student.accessibleSemesters.join(', ')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="faculty">
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subjects</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facultyUsers.map(faculty => (
                          <TableRow key={faculty.id}>
                            <TableCell className="font-medium">{faculty.id}</TableCell>
                            <TableCell>{faculty.name}</TableCell>
                            <TableCell>{faculty.email}</TableCell>
                            <TableCell>
                              {subjects.filter(s => s.teacherId === faculty.id).map(s => s.name).join(', ')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="subjects">
                  <div className="space-y-6">
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-4">Assign Teacher to Subject</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject-select">Select Subject</Label>
                          <Select 
                            value={selectedSubject || ''} 
                            onValueChange={setSelectedSubject}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map(subject => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.name} (Semester {subject.semesterId})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="teacher-select">Select Teacher</Label>
                          <Select 
                            value={selectedTeacher || ''} 
                            onValueChange={setSelectedTeacher}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {facultyUsers.map(teacher => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-end">
                          <Button 
                            onClick={handleAssignTeacher} 
                            className="w-full"
                          >
                            Assign Teacher
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Resources</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.map(subject => (
                          <TableRow key={subject.id}>
                            <TableCell className="font-medium">{subject.id}</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell>{subject.semesterId}</TableCell>
                            <TableCell>
                              {users.find(u => u.id === subject.teacherId)?.name || 'Unassigned'}
                            </TableCell>
                            <TableCell>{subject.resources?.length || 0} resources</TableCell>
                            <TableCell>
                              {subject.teacherId && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleUnassignTeacher(subject.id)}
                                >
                                  Unassign
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="warnings">
                  <div className="space-y-4">
                    {warnings.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Assignment</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {warnings.map(warning => (
                            <TableRow key={warning.id}>
                              <TableCell className="font-medium">
                                {users.find(u => u.id === warning.studentId)?.name || warning.studentId}
                              </TableCell>
                              <TableCell>{warning.assignmentId}</TableCell>
                              <TableCell>{warning.reason}</TableCell>
                              <TableCell>{warning.timestamp.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-muted-foreground">No warnings detected</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                <span>Grant Semester Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Select Student</Label>
                <Select 
                  value={selectedStudent || ''} 
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentUsers.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester-select">Select Semester</Label>
                <Select 
                  value={selectedSemester?.toString() || ''} 
                  onValueChange={(value) => setSelectedSemester(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleGrantAccess} 
                className="w-full"
              >
                Grant Access
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Students:</span>
                  <span className="font-medium">{studentUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Faculty:</span>
                  <span className="font-medium">{facultyUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Subjects:</span>
                  <span className="font-medium">{subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Warnings:</span>
                  <span className="font-medium">{warnings.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
