
import { Subject, Note, Resource } from '@/lib/interfaces/types';

// Subject-related context functions
export const useSubjectFunctions = (
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
) => {
  // Add subject function that accepts the correct parameters format
  const addSubject = (name: string, semesterId: number, description?: string): Subject => {
    const newSubject: Subject = {
      id: `subject_${Date.now()}`,
      name,
      semesterId,
      description,
      notes: [],
      resources: []
    };
    
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  // Update subjects function
  const updateSubjects = (newSubjects: Subject[]): void => {
    setSubjects(newSubjects);
  };

  // Add note function
  const addNote = (subjectId: string, title: string, content: string): string => {
    const noteId = `note_${Date.now()}`;
    
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? {
              ...subject,
              notes: [
                ...subject.notes,
                {
                  id: noteId,
                  title,
                  content,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              ]
            }
          : subject
      )
    );
    
    return noteId;
  };

  // Delete note function
  const deleteNote = (subjectId: string, noteId: string): boolean => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? {
              ...subject,
              notes: subject.notes.filter(note => note.id !== noteId)
            }
          : subject
      )
    );
    
    return true;
  };

  // Add resource function
  const addResource = (subjectId: string, title: string, url: string, type: string): string => {
    const resourceId = `resource_${Date.now()}`;
    
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? {
              ...subject,
              resources: [
                ...(subject.resources || []),
                {
                  id: resourceId,
                  title,
                  url,
                  type: type as 'video' | 'document' | 'link',
                  level: 'intermediate', // default level
                  topic: 'general', // default topic
                  createdAt: new Date(),
                  subjectId
                }
              ]
            }
          : subject
      )
    );
    
    return resourceId;
  };

  // Delete resource function
  const deleteResource = (subjectId: string, resourceId: string): boolean => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId && subject.resources
          ? {
              ...subject,
              resources: subject.resources.filter(resource => resource.id !== resourceId)
            }
          : subject
      )
    );
    
    return true;
  };

  // Assign teacher function
  const assignTeacher = (subjectId: string, teacherId: string): boolean => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? { ...subject, teacherId }
          : subject
      )
    );
    
    return true;
  };

  // Unassign teacher function
  const unassignTeacher = (subjectId: string): boolean => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? { ...subject, teacherId: undefined }
          : subject
      )
    );
    
    return true;
  };

  return { 
    addSubject, 
    updateSubjects, 
    addNote, 
    deleteNote, 
    addResource, 
    deleteResource,
    assignTeacher,
    unassignTeacher
  };
};
