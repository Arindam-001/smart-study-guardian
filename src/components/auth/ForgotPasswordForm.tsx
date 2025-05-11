
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/lib/auth-service';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await requestPasswordReset(email);
      
      if (success) {
        setIsSubmitted(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for a password reset link",
        });
      } else {
        toast({
          title: "Failed to send reset link",
          description: "Please verify your email address and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-edu-primary">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            If you don't see it within a few minutes, check your spam folder or request
            another reset link.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSubmitted(false)}
          >
            Try a different email
          </Button>
          <Link to="/" className="w-full">
            <Button
              variant="secondary"
              className="w-full"
            >
              Return to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-edu-primary">Reset Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a password reset link
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="your.email@institution.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full bg-edu-primary hover:bg-edu-secondary" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Link to="/" className="w-full text-center text-sm text-muted-foreground hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
