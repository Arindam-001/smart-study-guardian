
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

const FacultyDashboard = () => {
  const { user, subjects, addResource, updateAttendance } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState<'video' | 'link' | 'document'>('video');
  const [resourceLevel, setResourceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [resourceTopic, setResourceTopic] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  // Get subjects taught by this faculty member
  const taughtSubjects = subjects.filter(s => s.teacherId === user?.id);

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

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive"
      });
      return;
    }

    if (!resourceTitle || !resourceUrl || !resourceTopic) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addResource(selectedSubject, {
      title: resourceTitle,
      url: resourceUrl,
      type: resourceType,
      level: resourceLevel,
      topic: resourceTopic,
      subjectId: selectedSubject
    });

    toast({
      title: "Success",
      description: "Resource added successfully"
    });

    // Reset form
    setResourceTitle('');
    setResourceUrl('');
    setResourceTopic('');
  };

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    if (!selectedSubject) return;
    
    updateAttendance(studentId, selectedSubject, selectedDate, isPresent);
    
    toast({
      title: "Attendance Updated",
      description: `Attendance for student ${studentId} marked as ${isPresent ? 'present' : 'absent'}`
    });
  };

  // Mock students for attendance
  const students = [
    { id: '1', name: 'Student User', email: 'student@example.com' },
    { id: '4', name: 'John Doe', email: 'john@example.com' },
    { id: '5', name: 'Jane Smith', email: 'jane@example.com' }
  ];

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
          <div className="mb-6">
            <Label htmlFor="subject-select">Select Subject</Label>
            <Select 
              value={selectedSubject || ''} 
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {taughtSubjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSubject && (
            <Tabs defaultValue="resources">
              <TabsList className="mb-6">
                <TabsTrigger value="resources">Manage Resources</TabsTrigger>
                <TabsTrigger value="attendance">Manage Attendance</TabsTrigger>
                <TabsTrigger value="students">View Students</TabsTrigger>
              </TabsList>

              <TabsContent value="resources">
                <form onSubmit={handleResourceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resource-title">Resource Title</Label>
                      <Input
                        id="resource-title"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        placeholder="Introduction to Variables"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resource-url">Resource URL</Label>
                      <Input
                        id="resource-url"
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                        placeholder="https://example.com/resource"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resource-type">Resource Type</Label>
                      <Select 
                        value={resourceType} 
                        onValueChange={(v) => setResourceType(v as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resource-level">Difficulty Level</Label>
                      <Select 
                        value={resourceLevel} 
                        onValueChange={(v) => setResourceLevel(v as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resource-topic">Topic</Label>
                      <Input
                        id="resource-topic"
                        value={resourceTopic}
                        onChange={(e) => setResourceTopic(e.target.value)}
                        placeholder="programming basics"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="mt-4">Add Resource</Button>
                </form>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Existing Resources</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Topic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects
                        .find(s => s.id === selectedSubject)
                        ?.resources?.map(resource => (
                          <TableRow key={resource.id}>
                            <TableCell>{resource.title}</TableCell>
                            <TableCell>
                              <span className="capitalize">{resource.type}</span>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{resource.level}</span>
                            </TableCell>
                            <TableCell>{resource.topic}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No resources added yet
                            </TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="attendance">
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="attendance-date">Date</Label>
                      <Input
                        id="attendance-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-20"
                                onClick={() => handleAttendanceChange(student.id, true)}
                              >
                                <Check className="h-4 w-4 mr-1 text-green-500" /> Present
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-20"
                                onClick={() => handleAttendanceChange(student.id, false)}
                              >
                                <X className="h-4 w-4 mr-1 text-red-500" /> Absent
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="students">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
