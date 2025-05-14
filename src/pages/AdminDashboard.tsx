import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, BookOpen, AlertTriangle, ShieldAlert, User, Users, Trash2, LogOut } from 'lucide-react';
import SubjectManagement from '@/components/admin/SubjectManagement';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { deleteUser } from '@/lib/auth/user-management';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/local-storage';
import { impersonateUser } from '@/lib/auth/auth-core';

const AdminDashboard = () => {
  const { 
    user, 
    users, 
    subjects, 
    warnings, 
    semesters, 
    grantSemesterAccess,
    clearAllUserData,
  } = useAppContext();
  
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
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

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(true);
    
    try {
      // Use the imported deleteUser function to handle both DB and local storage
      const success = await deleteUser(userId);
      
      if (success) {
        toast({
          title: "User Deleted",
          description: "The user has been successfully removed from the system."
        });
        
        // Force reload to update the context
        window.location.reload();
      } else {
        throw new Error("Failed to delete user");
      }
      
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Deletion Failed",
        description: "An error occurred while trying to delete the user.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const studentUsers = users.filter(u => u.role === 'student');
  const facultyUsers = users.filter(u => u.role === 'teacher');

  // Improved admin view functionality to properly impersonate another user
  const goToUserDashboard = (userId: string, role: string) => {
    // Use our new impersonation function
    const impersonated = impersonateUser(userId, user);
    
    if (impersonated) {
      toast({
        title: "View mode activated",
        description: `You are now viewing as ${impersonated.name}`,
      });
      
      // Navigate to the appropriate dashboard
      const dashboardPath = role === 'student' ? '/student-dashboard' : '/faculty-dashboard';
      window.location.href = dashboardPath;
    } else {
      toast({
        title: "View failed",
        description: "Could not view as the selected user",
        variant: "destructive"
      });
    }
  };

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
              <Tabs defaultValue="subjects">
                <TabsList className="mb-6">
                  <TabsTrigger value="subjects" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Subjects</span>
                  </TabsTrigger>
                  <TabsTrigger value="students" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Students</span>
                  </TabsTrigger>
                  <TabsTrigger value="faculty" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Faculty</span>
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
                
                <TabsContent value="subjects">
                  <SubjectManagement />
                </TabsContent>
                
                <TabsContent value="students">
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Current Semester</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentUsers.map(student => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.enrolledCourse || 'N/A'}</TableCell>
                            <TableCell>{student.currentSemester}</TableCell>
                            <TableCell className="space-x-2">
                              <Button size="sm" onClick={() => goToUserDashboard(student.id, 'student')}>
                                View
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" size="sm" onClick={() => setUserToDelete(student.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Student</DialogTitle>
                                  </DialogHeader>
                                  <p>Are you sure you want to delete {student.name}?</p>
                                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleDeleteUser(student.id)}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? "Deleting..." : "Delete Student"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
                          <TableHead>Actions</TableHead>
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
                            <TableCell className="space-x-2">
                              <Button size="sm" onClick={() => goToUserDashboard(faculty.id, 'teacher')}>
                                View
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" size="sm" onClick={() => setUserToDelete(faculty.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Faculty Member</DialogTitle>
                                  </DialogHeader>
                                  <p>Are you sure you want to delete {faculty.name}?</p>
                                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleDeleteUser(faculty.id)}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? "Deleting..." : "Delete Faculty"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
                  value={selectedStudent || 'placeholder'} 
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>Select a student</SelectItem>
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
                  value={selectedSemester?.toString() || 'placeholder'} 
                  onValueChange={(value) => {
                    if (value === 'placeholder') return;
                    setSelectedSemester(Number(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>Select a semester</SelectItem>
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
