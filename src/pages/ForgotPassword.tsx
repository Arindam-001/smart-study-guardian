
import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-primary mb-4">Password Reset</h1>
        <p className="text-xl text-edu-dark max-w-md">Forgot your password? We'll help you recover it.</p>
      </div>
      
      <ForgotPasswordForm />
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground mb-2">Remember your password?</p>
        <Link to="/" className="text-edu-primary hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
