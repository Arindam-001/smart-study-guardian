
import { Subject, Note, Resource } from '@/lib/interfaces/types';

// Subject-related context functions
export const useSubjectFunctions = (
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
) => {
  // Add subject function
  const addSubject = (subject: Omit<Subject, 'id' | 'notes'>): Subject => {
    const newSubject: Subject = {
      ...subject,
      id: `subject_${Date.now()}`,
      notes: [],
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  // Update subjects function
  const updateSubjects = (subjects: Subject[]): void => {
    setSubjects(subjects);
  };

  // Add note function
  const addNote = (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void => {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, notes: [...subject.notes, newNote] }
          : subject
      )
    );
  };

  // Delete note function
  const deleteNote = (subjectId: string, noteId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, notes: subject.notes.filter(note => note.id !== noteId) }
          : subject
      )
    );
  };

  // Add resource function
  const addResource = (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>): Resource => {
    const newResource: Resource = {
      ...resource,
      id: `resource_${Date.now()}`,
      createdAt: new Date(),
      subjectId,
    };
    
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { 
              ...subject, 
              resources: subject.resources 
                ? [...subject.resources, newResource] 
                : [newResource] 
            }
          : subject
      )
    );
    
    return newResource;
  };

  // Delete resource function
  const deleteResource = (subjectId: string, resourceId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId && subject.resources
          ? { 
              ...subject, 
              resources: subject.resources.filter(resource => resource.id !== resourceId)
            }
          : subject
      )
    );
  };

  // Assign teacher function
  const assignTeacher = (subjectId: string, teacherId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, teacherId }
          : subject
      )
    );
  };

  // Unassign teacher function
  const unassignTeacher = (subjectId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, teacherId: undefined }
          : subject
      )
    );
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
