
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/lib/context';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/local-storage';
import { User } from '@/lib/interfaces/types';
import { signIn } from '@/lib/auth/auth-core';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAppContext();
  const navigate = useNavigate();

  // Clear any existing impersonation data on component mount
  useEffect(() => {
    const currentUser = getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
    const adminBackup = getItem('ADMIN_USER_BACKUP', null);
    
    // If there's no current user but there is an admin backup, something is wrong
    // Clean up the admin backup to prevent unauthorized access
    if (!currentUser && adminBackup) {
      removeItem('ADMIN_USER_BACKUP');
    }
    
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    if (users.length > 0) {
      console.log(`Found ${users.length} registered users in storage`);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // First try to get users from local storage to check if the user exists
      const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email);
      
      if (!user) {
        toast({
          title: "Login failed",
          description: "User not found. Please check your email or register a new account.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // If user exists, try to authenticate
      setItem(STORAGE_KEYS.AUTH_USER, user);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Check if there's a pending admin backup
      const adminBackup = getItem('ADMIN_USER_BACKUP', null);
      if (adminBackup) {
        // Clear it if logging in normally
        removeItem('ADMIN_USER_BACKUP');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
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
        <CardTitle className="text-2xl text-edu-primary">Student Portal Login</CardTitle>
        <CardDescription>
          Enter your email to log in to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-edu-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-edu-primary hover:bg-edu-secondary" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
