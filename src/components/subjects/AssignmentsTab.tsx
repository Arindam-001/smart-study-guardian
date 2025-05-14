
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context';
import { Assignment, Subject } from '@/lib/interfaces/types';
import { Shield, AlertTriangle, File } from 'lucide-react';
import SubmissionsView from '@/components/faculty/SubmissionsView';
import CreateAssignmentForm from '@/components/assignment/CreateAssignmentForm';
import TakeAssignment from '@/components/assignment/TakeAssignment';
import AssignmentEditor from '@/components/assignment/AssignmentEditor';
import { useToast } from '@/components/ui/use-toast';
import QuickAssignmentGenerator from '@/components/faculty/QuickAssignmentGenerator';

interface AssignmentsTabProps {
  subject: Subject;
  showTakeAssignment: boolean;
  setShowTakeAssignment: (show: boolean) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  updateUrlParams: (tab: string, assignmentId?: string | null) => void;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  subject,
  showTakeAssignment,
  setShowTakeAssignment,
  selectedAssignmentId,
  setSelectedAssignmentId,
  updateUrlParams
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, assignments, warnings } = useAppContext();
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showAssignmentEditor, setShowAssignmentEditor] = useState(false);
  
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const hasWarnings = warnings.some(w => w.assignmentId.startsWith(subject.id));
  
  // Get subject assignments
  const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);
  const selectedAssignment = selectedAssignmentId ? 
    subjectAssignments.find(a => a.id === selectedAssignmentId) : 
    subjectAssignments[0];
  
  const handleAssignmentCreated = () => {
    toast({
      title: "Assignment created",
      description: "The assignment has been successfully created."
    });
  };
  
  return (
    <div className="mb-6">
      {isTeacherOrAdmin && !showCreateAssignment && !showTakeAssignment && !showAssignmentEditor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <QuickAssignmentGenerator 
            subjectId={subject.id} 
            onAssignmentCreated={handleAssignmentCreated}
          />
          
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
            updateUrlParams('assignments', subjectAssignments[0].id);
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
          onComplete={() => {
            setShowCreateAssignment(false);
            toast({
              title: "Assignment created",
              description: "The assignment has been successfully created."
            });
          }}
        />
      )}
      
      {showTakeAssignment && selectedAssignment && (
        <TakeAssignment 
          assignment={selectedAssignment}
          onComplete={() => {
            setShowTakeAssignment(false);
            setSelectedAssignmentId(null);
            updateUrlParams('assignments');
            toast({
              title: "Assignment submitted",
              description: "Your assignment has been submitted successfully."
            });
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
                                updateUrlParams('assignments', assignment.id);
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
                              updateUrlParams('assignments', assignment.id);
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
  );
};

export default AssignmentsTab;
