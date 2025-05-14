
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { Assignment, Resource } from '@/lib/interfaces/types';
import AssignmentEditor from '@/components/assignment/AssignmentEditor';

const SubjectView = () => {
  const { semesterId, subjectId } = useParams<{ semesterId: string, subjectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const assignmentIdParam = searchParams.get('assignmentId');
  
  const { user, subjects, warnings, assignments, deleteNote, deleteResource } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'notes');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
  const [showAssignmentEditor, setShowAssignmentEditor] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignmentIdParam);
  
  // Effect to handle URL params
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (assignmentIdParam) {
      setSelectedAssignmentId(assignmentIdParam);
      setShowTakeAssignment(true);
    }
  }, [tabParam, assignmentIdParam]);
  
  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab]);

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
  const selectedAssignment = assignmentIdParam ? 
    subjectAssignments.find(a => a.id === assignmentIdParam) : 
    subjectAssignments[0];

  // Check if there are warnings for this subject
  const hasWarnings = warnings.some(w => w.assignmentId.startsWith(subjectId));
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';
  
  // Get resources
  const videoResources = subject.resources?.filter(r => r.type === 'video') || [];
  const documentResources = subject.resources?.filter(r => r.type === 'document') || [];
  const linkResources = subject.resources?.filter(r => r.type === 'link') || [];

  // Handle note deletion
  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(subject.id, noteId);
    }
  };
  
  // Handle resource deletion
  const handleDeleteResource = (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteResource(subject.id, resourceId);
    }
  };

  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
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
                    <NoteItem 
                      key={note.id} 
                      note={note} 
                      isTeacher={isTeacherOrAdmin}
                      onDelete={isTeacherOrAdmin ? () => handleDeleteNote(note.id) : undefined}
                    />
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
                            onDelete={isTeacherOrAdmin ? () => handleDeleteResource(resource.id) : undefined}
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
                            onDelete={isTeacherOrAdmin ? () => handleDeleteResource(resource.id) : undefined}
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
                            onDelete={isTeacherOrAdmin ? () => handleDeleteResource(resource.id) : undefined}
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
              {isTeacherOrAdmin && !showCreateAssignment && !showTakeAssignment && !showAssignmentEditor && (
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
                  onClick={() => {
                    setShowTakeAssignment(true);
                    setSelectedAssignmentId(subjectAssignments[0].id);
                  }}
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
              
              {showTakeAssignment && selectedAssignment && (
                <TakeAssignment 
                  assignment={selectedAssignment}
                  onComplete={() => {
                    setShowTakeAssignment(false);
                    setSelectedAssignmentId(null);
                  }}
                />
              )}
              
              {showAssignmentEditor && (
                <AssignmentEditor
                  onClose={() => setShowAssignmentEditor(false)}
                />
              )}
              
              {/* Subject Assignments List */}
              {!showCreateAssignment && !showTakeAssignment && !showAssignmentEditor && (
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
                                  {assignment.questions.length} questions • {assignment.duration || 30} minutes
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {isTeacherOrAdmin ? (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => {
                                        setSelectedAssignmentId(assignment.id);
                                      }}
                                    >
                                      View Submissions
                                    </Button>
                                  </>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      setSelectedAssignmentId(assignment.id);
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
  onDelete?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, type, onDelete }) => {
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
          
          <div className="mt-2 flex justify-between items-center">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-edu-primary hover:underline"
            >
              {getTypeIcon()}
              <span className="ml-1">Access Resource</span>
            </a>
            
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700" 
                onClick={onDelete}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectView;
