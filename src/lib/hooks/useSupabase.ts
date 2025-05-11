
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Tables } from '../supabase';
import { 
  User, UserRole, Subject, Note, Resource, Assignment, 
  Warning, StudentPerformance, Question 
} from '../interfaces/types';
import { AssignmentSubmission } from '../interfaces/assignment';

export const useSupabaseUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        currentSemester: user.current_semester,
        accessibleSemesters: user.accessible_semesters,
      })) || [];
    }
  });
};

export const useSupabaseUser = (email: string) => {
  return useQuery({
    queryKey: ['user', email],
    queryFn: async (): Promise<User | null> => {
      if (!email) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      
      return data ? {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        currentSemester: data.current_semester,
        accessibleSemesters: data.accessible_semesters,
      } : null;
    },
    enabled: !!email
  });
};

export const useSupabaseSubjects = (semesterId?: number) => {
  return useQuery({
    queryKey: ['subjects', semesterId],
    queryFn: async (): Promise<Subject[]> => {
      let query = supabase
        .from('subjects')
        .select(`
          *,
          notes(*),
          resources(*)
        `);
        
      if (semesterId !== undefined) {
        query = query.eq('semester_id', semesterId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(subj => ({
        id: subj.id,
        name: subj.name,
        semesterId: subj.semester_id,
        teacherId: subj.teacher_id,
        notes: subj.notes.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: new Date(note.created_at),
          updatedAt: new Date(note.updated_at),
        })),
        resources: subj.resources.map((resource: any) => ({
          id: resource.id,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          level: resource.level,
          topic: resource.topic,
          createdAt: new Date(resource.created_at),
          subjectId: resource.subject_id,
        })),
      })) || [];
    }
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      name, email, password, id, role, currentSemester = 1 
    }: { 
      name: string; 
      email: string; 
      password: string; 
      id: string; 
      role: string; 
      currentSemester?: number; 
    }) => {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Now create user in our users table
      const { data, error } = await supabase
        .from('users')
        .insert({
          id,
          name,
          email,
          role,
          current_semester: role === 'student' ? currentSemester : 0,
          accessible_semesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
          auth_id: authData.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return !!data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subject: Omit<Subject, 'id' | 'notes'>) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name: subject.name,
          semester_id: subject.semesterId,
          teacher_id: subject.teacherId,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      subjectId, 
      note 
    }: { 
      subjectId: string; 
      note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> 
    }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          subject_id: subjectId,
          title: note.title,
          content: note.content,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });
};

export const useAddResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      subjectId, 
      resource 
    }: { 
      subjectId: string; 
      resource: Omit<Resource, 'id' | 'createdAt'> 
    }) => {
      const { data, error } = await supabase
        .from('resources')
        .insert({
          subject_id: subjectId,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          level: resource.level,
          topic: resource.topic,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      subjectId, 
      title, 
      questions 
    }: { 
      subjectId: string; 
      title: string; 
      questions: Omit<Question, 'id'>[] 
    }) => {
      // First create the assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .insert({
          subject_id: subjectId,
          title,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();
      
      if (assignmentError) throw assignmentError;
      
      // Then create all questions
      const questionsToInsert = questions.map(question => ({
        assignment_id: assignment.id,
        text: question.text,
        options: question.options || null,
        correct_answer: question.correctAnswer || null,
        type: question.type,
        topic: question.topic || 'general',
      }));
      
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();
      
      if (questionError) throw questionError;
      
      return {
        ...assignment,
        questions: questionData,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      assignmentId, 
      studentId, 
      answers, 
      fileUrl 
    }: { 
      assignmentId: string; 
      studentId: string; 
      answers: Record<string, string>; 
      fileUrl?: string 
    }) => {
      // First create the submission
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          assignment_id: assignmentId,
          student_id: studentId,
          submitted_at: new Date().toISOString(),
          file_url: fileUrl || null,
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      // Then create all submission answers
      const answersToInsert = Object.entries(answers).map(([questionId, answer]) => ({
        submission_id: submission.id,
        question_id: questionId,
        answer,
      }));
      
      const { error: answerError } = await supabase
        .from('submission_answers')
        .insert(answersToInsert);
      
      if (answerError) throw answerError;
      
      return submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['performance'] });
    }
  });
};

export const useUpdateContext = () => {
  // This is a hook that will be used to update the AppContext with data from Supabase
  const { data: users } = useSupabaseUsers();
  const { data: subjects } = useSupabaseSubjects();
  
  // Return all the data needed to update the context
  return {
    users: users || [],
    subjects: subjects || [],
  };
};
