
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Initialize Supabase client with default development values
// In production, these should be set as environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we're in development and using the fallback values
if ((!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && import.meta.env.DEV) {
  console.warn('Using fallback Supabase credentials. For development purposes only.');
  console.warn('Please set up your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Type definitions for database
export type Tables = {
  users: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    current_semester: number;
    accessible_semesters: number[];
    created_at: string;
  };
  subjects: {
    id: string;
    name: string;
    semester_id: number;
    teacher_id: string;
    created_at: string;
  };
  notes: {
    id: string;
    subject_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
  resources: {
    id: string;
    subject_id: string;
    title: string;
    type: 'video' | 'link' | 'document';
    url: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    topic: string;
    created_at: string;
  };
  assignments: {
    id: string;
    subject_id: string;
    title: string;
    due_date: string;
    created_at: string;
  };
  questions: {
    id: string;
    assignment_id: string;
    text: string;
    options: string[] | null;
    correct_answer: string | null;
    type: 'multiple-choice' | 'text';
    topic: string | null;
  };
  submissions: {
    id: string;
    assignment_id: string;
    student_id: string;
    submitted_at: string;
    score: number | null;
    feedback: string | null;
    file_url: string | null;
  };
  submission_answers: {
    id: string;
    submission_id: string;
    question_id: string;
    answer: string;
  };
  warnings: {
    id: string;
    student_id: string;
    assignment_id: string;
    reason: string;
    timestamp: string;
  };
  attendance: {
    id: string;
    student_id: string;
    subject_id: string;
    date: string;
    present: boolean;
  };
}
