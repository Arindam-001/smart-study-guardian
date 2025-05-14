
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { validateEmail, validatePhone, validateDomain } from '../utils/registration-validation';
import { getSemesterCountByProgram } from '@/lib/auth-service';
import { User } from '@/lib/interfaces/types';
import { signUp } from '@/lib/auth/user-management';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/local-storage';

export const useRegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [enrolledCourse, setEnrolledCourse] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [maxSemesters, setMaxSemesters] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEnrolledCourseChange = (course: string) => {
    setEnrolledCourse(course);
    
    if (course && role === 'student') {
      const semCount = getSemesterCountByProgram(course);
      setMaxSemesters(Array.from({ length: semCount }, (_, i) => i + 1));
      
      // Reset current semester if it's higher than the new max
      if (currentSemester > semCount) {
        setCurrentSemester(1);
      }
    }
  };

  const handleRoleChange = (newRole: 'student' | 'teacher' | 'admin') => {
    setRole(newRole);
    
    // Reset domain-specific fields when changing role
    setEmail('');
    
    if (newRole === 'student' && enrolledCourse) {
      // Update semesters based on enrolled course
      const semCount = getSemesterCountByProgram(enrolledCourse);
      setMaxSemesters(Array.from({ length: semCount }, (_, i) => i + 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Domain validation
    if (!validateDomain(email, role)) {
      toast({
        title: "Invalid email domain",
        description: `${role === 'admin' ? 'Administrators' : role === 'teacher' ? 'Faculty' : 'Students'} must use ${role === 'admin' ? '@admin.com' : role === 'teacher' ? '@faculty.com' : '@college.com'} email domain`,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Validate phone
    if (phone && !validatePhone(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number (10-15 digits).",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // First try with the signUp function from user-management with userData object
      const success = await signUp(
        name,
        email,
        password,
        id,
        role,
        currentSemester,
        phone,
        role === 'student' ? enrolledCourse : undefined
      );
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your credentials.",
        });
        
        navigate('/');
        return;
      }
      
      // As a fallback, directly manipulate local storage
      const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email || u.id === id);
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "This email or ID is already in use.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser: User = {
        id,
        name,
        email,
        role,
        currentSemester: role === 'student' ? currentSemester : 0,
        accessibleSemesters: role === 'student' ? 
          Array.from({ length: maxSemesters.length }, (_, i) => i + 1) : 
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        phone,
        enrolledCourse: role === 'student' ? enrolledCourse : undefined
      };
      
      // Add user to users array
      users.push(newUser);
      setItem(STORAGE_KEYS.USERS, users);
      
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState: {
      name, setName,
      email, setEmail, 
      password, setPassword,
      phone, setPhone,
      id, setId,
      enrolledCourse, setEnrolledCourse,
      role, setRole,
      currentSemester, setCurrentSemester,
      isLoading,
      maxSemesters
    },
    handlers: {
      handleEnrolledCourseChange,
      handleRoleChange,
      handleSubmit
    }
  };
};
