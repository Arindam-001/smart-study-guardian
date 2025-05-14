
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/lib/context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [enrolledCourse, setEnrolledCourse] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { registerUser, semesters } = useAppContext();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic validation - allows various formats
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
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
      // Register with enhanced user data including enrolled course
      const userData = {
        name,
        email,
        password,
        id,
        role,
        currentSemester,
        phone,
        enrolledCourse: role === 'student' ? enrolledCourse : undefined
      };
      
      const success = await registerUser(
        userData.name, 
        userData.email, 
        userData.password, 
        userData.id, 
        userData.role, 
        userData.currentSemester, 
        userData.phone,
        userData.enrolledCourse
      );
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your credentials.",
        });
        navigate('/');
      } else {
        toast({
          title: "Registration failed",
          description: "This email or ID may already be in use.",
          variant: "destructive"
        });
      }
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-edu-primary">Register New Account</CardTitle>
        <CardDescription>
          Create your account to access the portal
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="your.email@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1234567890"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">For password recovery via OTP</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="id">Student/Faculty ID</Label>
            <Input
              id="id"
              placeholder="e.g., S12345 or F67890"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as 'student' | 'teacher' | 'admin')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Faculty</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {role === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="enrolled-course">Enrolled Course</Label>
                <Input
                  id="enrolled-course"
                  placeholder="e.g., Computer Science, Electrical Engineering"
                  value={enrolledCourse}
                  onChange={(e) => setEnrolledCourse(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Current Semester</Label>
                <Select 
                  value={currentSemester.toString()} 
                  onValueChange={(value) => setCurrentSemester(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full bg-edu-primary hover:bg-edu-secondary" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
