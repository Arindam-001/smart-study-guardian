
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-primary mb-4">Student Portal</h1>
        <p className="text-xl text-edu-dark max-w-md">Access your courses, assignments, and grades in one place</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground mb-2">New to the platform?</p>
        <Link to="/register">
          <Button variant="outline">
            Register New Account
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
