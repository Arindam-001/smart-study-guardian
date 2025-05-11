
-- Create tables for student portal database

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  current_semester INTEGER DEFAULT 1,
  accessible_semesters INTEGER[] DEFAULT '{1}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);
  
CREATE POLICY "Admin can view all user data" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can view all student data" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND role = 'teacher'
    )
  );

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  semester_id INTEGER NOT NULL,
  teacher_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'link', 'document')),
  url TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options TEXT[] NULL,
  correct_answer TEXT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'text')),
  topic TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  score INTEGER NULL,
  feedback TEXT NULL,
  file_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (assignment_id, student_id)
);

-- Submission answers table
CREATE TABLE submission_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (submission_id, question_id)
);

-- Warnings table
CREATE TABLE warnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES users(id),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES users(id),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  present BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (student_id, subject_id, date)
);

-- Create RLS policies for all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select from most tables
CREATE POLICY "Authenticated users can view subjects" ON subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view notes" ON notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view resources" ON resources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view assignments" ON assignments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view questions" ON questions FOR SELECT USING (auth.role() = 'authenticated');

-- Specific policies for submissions and answers
CREATE POLICY "Students can view their own submissions" ON submissions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = student_id
    )
  );

CREATE POLICY "Teachers and admins can view all submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Students can insert their own submissions" ON submissions
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = student_id
    )
  );

-- Similar policies for submission answers
CREATE POLICY "Users can view answers to their submissions" ON submission_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.id = submission_id AND u.auth_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view all submission answers" ON submission_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Students can insert answers to their submissions" ON submission_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.id = submission_id AND u.auth_id = auth.uid()
    )
  );

-- Attendance policies
CREATE POLICY "Students can view their own attendance" ON attendance
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = student_id
    )
  );

CREATE POLICY "Teachers can manage attendance" ON attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND role = 'teacher'
    )
  );

-- Warning policies
CREATE POLICY "Teachers and admins can manage warnings" ON warnings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );
