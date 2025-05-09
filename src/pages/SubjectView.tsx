
import React, { useState } from 'react';
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
import { BookOpen, File, Shield, AlertTriangle } from 'lucide-react';

const SubjectView = () => {
  const { semesterId, subjectId } = useParams<{ semesterId: string, subjectId: string }>();
  const navigate = useNavigate();
  const { user, subjects, warnings } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
  
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

  // Check if there are warnings for this subject
  const hasWarnings = warnings.some(w => w.assignmentId.startsWith(subjectId));
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';

  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Notes</span>
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
                    <span className="text-xs text-white/80">Generate 20 questions from notes</span>
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
              
              {!isTeacherOrAdmin && !showTakeAssignment && (
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
              
              {!showCreateAssignment && !showTakeAssignment && (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium text-edu-dark">No active assignments</h3>
                  {isTeacherOrAdmin ? (
                    <p className="text-muted-foreground mt-2">Create a new assignment for your students.</p>
                  ) : (
                    <p className="text-muted-foreground mt-2">Take an assignment to receive personalized recommendations.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SubjectView;
