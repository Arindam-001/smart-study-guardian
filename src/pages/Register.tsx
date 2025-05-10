
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-primary mb-4">Student Portal</h1>
        <p className="text-xl text-edu-dark max-w-md">Register for an account to access your courses</p>
      </div>
      
      <RegisterForm />
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground mb-2">Already have an account?</p>
        <Link to="/">
          <Button variant="outline">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
