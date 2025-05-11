
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string | null
          name: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          current_semester: number
          accessible_semesters: number[]
          created_at: string
        }
        Insert: {
          id: string
          auth_id?: string | null
          name: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          current_semester?: number
          accessible_semesters?: number[]
          created_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          name?: string
          email?: string
          role?: 'student' | 'teacher' | 'admin'
          current_semester?: number
          accessible_semesters?: number[]
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          semester_id: number
          teacher_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          semester_id: number
          teacher_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          semester_id?: number
          teacher_id?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          subject_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          subject_id: string
          title: string
          type: 'video' | 'link' | 'document'
          url: string
          level: 'beginner' | 'intermediate' | 'advanced'
          topic: string
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          type: 'video' | 'link' | 'document'
          url: string
          level: 'beginner' | 'intermediate' | 'advanced'
          topic: string
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          type?: 'video' | 'link' | 'document'
          url?: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          topic?: string
          created_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          subject_id: string
          title: string
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          due_date?: string
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          assignment_id: string
          text: string
          options: string[] | null
          correct_answer: string | null
          type: 'multiple-choice' | 'text'
          topic: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          text: string
          options?: string[] | null
          correct_answer?: string | null
          type: 'multiple-choice' | 'text'
          topic?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          text?: string
          options?: string[] | null
          correct_answer?: string | null
          type?: 'multiple-choice' | 'text'
          topic?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          submitted_at: string
          score: number | null
          feedback: string | null
          file_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          submitted_at: string
          score?: number | null
          feedback?: string | null
          file_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          submitted_at?: string
          score?: number | null
          feedback?: string | null
          file_url?: string | null
          created_at?: string
        }
      }
      submission_answers: {
        Row: {
          id: string
          submission_id: string
          question_id: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          question_id: string
          answer: string
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          question_id?: string
          answer?: string
          created_at?: string
        }
      }
      warnings: {
        Row: {
          id: string
          student_id: string
          assignment_id: string
          reason: string
          timestamp: string
        }
        Insert: {
          id?: string
          student_id: string
          assignment_id: string
          reason: string
          timestamp?: string
        }
        Update: {
          id?: string
          student_id?: string
          assignment_id?: string
          reason?: string
          timestamp?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          subject_id: string
          date: string
          present: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_id: string
          date: string
          present: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_id?: string
          date?: string
          present?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
