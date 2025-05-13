
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/lib/auth-service';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const otpSchema = z.object({
  otp: z.string().min(6, "Your OTP code must be 6 characters.").max(6)
});

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await requestPasswordReset(email);
      
      if (success) {
        setIsOtpSent(true);
        toast({
          title: "OTP sent",
          description: "Check your email for a password reset OTP",
        });
      } else {
        toast({
          title: "Failed to send OTP",
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

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      setIsLoading(true);
      // In a real app, you would verify the OTP with your backend
      // For this demo, we'll simulate a successful verification
      console.log("Verifying OTP:", values.otp);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any 6-digit code
      setIsOtpVerified(true);
      setResetToken(email); // In a real app, this would be a unique token from your backend
      
      toast({
        title: "OTP verified",
        description: "You can now reset your password",
      });
      
      // Navigate to reset password page with the token
      navigate(`/reset-password?token=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification failed",
        description: "Invalid or expired OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isOtpSent && !isOtpVerified) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-edu-primary">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onOtpSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the 6-digit code sent to your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-edu-primary hover:bg-edu-secondary" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setIsOtpSent(false)}
                type="button"
              >
                Try a different email
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-edu-primary">Reset Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a code to reset your password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSendOtp}>
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full bg-edu-primary hover:bg-edu-secondary" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
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
