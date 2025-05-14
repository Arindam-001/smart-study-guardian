
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NoteItem from '@/components/notes/NoteItem';
import AddNoteForm from '@/components/notes/AddNoteForm';
import CreateAssignmentForm from '@/components/assignment/CreateAssignmentForm';
import TakeAssignment from '@/components/assignment/TakeAssignment';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, File, Shield, AlertTriangle, Link as LinkIcon, Video, FileText } from 'lucide-react';
import SubmissionsView from '@/components/faculty/SubmissionsView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Resource } from '@/lib/interfaces/types';

const SubjectView = () => {
  const { semesterId, subjectId } = useParams<{ semesterId: string, subjectId: string }>();
  const navigate = useNavigate();
  const { user, subjects, warnings, assignments } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  
  if (!user || !subjectId) {
    navigate('/');
    return null;
  }

  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return (
      <DashboardLayout title="Subject Not Found">
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-edu-dark">Subject not found</h3>
          <Button 
            onClick={() => navigate(`/semester/${semesterId}`)} 
            className="mt-4"
            variant="outline"
          >
            Go Back to Semester
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Get subject assignments
  const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);

  // Check if there are warnings for this subject
  const hasWarnings = warnings.some(w => w.assignmentId.startsWith(subjectId));
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';
  
  // Get resources
  const videoResources = subject.resources?.filter(r => r.type === 'video') || [];
  const documentResources = subject.resources?.filter(r => r.type === 'document') || [];
  const linkResources = subject.resources?.filter(r => r.type === 'link') || [];

  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2 relative">
              <File size={16} />
              <span>Assignments</span>
              {hasWarnings && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  <AlertTriangle size={10} />
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes">
            <div className="mb-6">
              {isTeacherOrAdmin && !showAddNote && (
                <Button onClick={() => setShowAddNote(true)} className="bg-edu-primary mb-4">
                  Add New Note
                </Button>
              )}
              
              {showAddNote && (
                <AddNoteForm 
                  subjectId={subject.id} 
                  onComplete={() => setShowAddNote(false)}
                />
              )}

              {subject.notes.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium text-edu-dark">No notes available for this subject yet.</h3>
                  {isTeacherOrAdmin && (
                    <p className="text-muted-foreground mt-2">Click 'Add New Note' to create your first note.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {subject.notes.map(note => (
                    <NoteItem key={note.id} note={note} isTeacher={isTeacherOrAdmin} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4">Learning Resources</h3>
              
              {(!subject.resources || subject.resources.length === 0) ? (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium text-edu-dark">No resources available for this subject yet.</h3>
                  {isTeacherOrAdmin && (
                    <p className="text-muted-foreground mt-2">
                      Please add resources in the Faculty Dashboard.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Video Resources */}
                  {videoResources.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 flex items-center">
                        <Video className="h-5 w-5 mr-2" />
                        Video Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videoResources.map(resource => (
                          <ResourceCard 
                            key={resource.id} 
                            resource={resource} 
                            type="video"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Document Resources */}
                  {documentResources.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Document Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documentResources.map(resource => (
                          <ResourceCard 
                            key={resource.id} 
                            resource={resource} 
                            type="document"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Link Resources */}
                  {linkResources.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2" />
                        Web Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {linkResources.map(resource => (
                          <ResourceCard 
                            key={resource.id} 
                            resource={resource} 
                            type="link"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assignments">
            <div className="mb-6">
              {isTeacherOrAdmin && !showCreateAssignment && !showTakeAssignment && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Button 
                    onClick={() => setShowCreateAssignment(true)} 
                    className="bg-edu-primary h-auto py-6 flex flex-col items-center gap-2"
                  >
                    <Shield size={24} />
                    <span className="font-medium">Create Assignment</span>
                    <span className="text-xs text-white/80">Generate questions from notes</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center gap-2"
                    onClick={() => navigate('/notifications')}
                  >
                    <AlertTriangle size={24} className={hasWarnings ? "text-red-500" : ""} />
                    <span className="font-medium">View Warnings</span>
                    <span className="text-xs">{hasWarnings ? "Student violations detected!" : "No violations detected"}</span>
                  </Button>
                </div>
              )}
              
              {!isTeacherOrAdmin && !showTakeAssignment && subjectAssignments.length > 0 && (
                <Button 
                  onClick={() => setShowTakeAssignment(true)} 
                  className="bg-edu-primary mb-4 h-auto py-6 flex flex-col items-center gap-2 w-full"
                >
                  <File size={24} />
                  <span className="font-medium">Take Assignment</span>
                  <span className="text-xs text-white/80">
                    Complete the assessment to get personalized recommendations
                  </span>
                </Button>
              )}
              
              {showCreateAssignment && (
                <CreateAssignmentForm 
                  subjectId={subject.id} 
                  onComplete={() => setShowCreateAssignment(false)}
                />
              )}
              
              {showTakeAssignment && (
                <TakeAssignment 
                  assignment={{
                    id: 'sample',
                    subjectId: subject.id,
                    title: 'Sample Assignment',
                    questions: Array(20).fill(null).map((_, i) => ({
                      id: `q-${i}`,
                      text: `Sample question ${i + 1} about ${subject.name}?`,
                      type: 'text',
                      topic: ['programming basics', 'data structures', 'algorithms', 'oop'][i % 4]
                    })),
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    createdAt: new Date()
                  }}
                  onComplete={() => setShowTakeAssignment(false)}
                />
              )}
              
              {/* Subject Assignments List */}
              {!showCreateAssignment && !showTakeAssignment && (
                <>
                  {subjectAssignments.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Assignments</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {subjectAssignments.map(assignment => (
                          <div 
                            key={assignment.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                              <div>
                                <h4 className="font-medium">{assignment.title}</h4>
                                <div className="text-sm text-muted-foreground">
                                  Due: {assignment.dueDate.toLocaleString()}
                                </div>
                                <div className="text-sm">
                                  {assignment.questions.length} questions • {assignment.duration} minutes
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {isTeacherOrAdmin ? (
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      setSelectedAssignmentId(assignment.id);
                                    }}
                                  >
                                    View Submissions
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      setShowTakeAssignment(true);
                                    }}
                                  >
                                    Take Assignment
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedAssignmentId && isTeacherOrAdmin && (
                        <div className="mt-8">
                          <SubmissionsView assignmentId={selectedAssignmentId} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                      <h3 className="text-lg font-medium text-edu-dark">No active assignments</h3>
                      {isTeacherOrAdmin ? (
                        <p className="text-muted-foreground mt-2">Create a new assignment for your students.</p>
                      ) : (
                        <p className="text-muted-foreground mt-2">No assignments available for this subject.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Resource Card Component
interface ResourceCardProps {
  resource: Resource;
  type: 'video' | 'document' | 'link';
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, type }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{resource.title}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs ${getLevelColor(resource.level)}`}>
            {resource.level}
          </div>
        </div>
        <CardDescription>{resource.description || `${type} resource on ${resource.topic}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Topic:</span> {resource.topic}
          </div>
          
          <div className="mt-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-edu-primary hover:underline"
            >
              {getTypeIcon()}
              <span className="ml-1">Access Resource</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectView;
