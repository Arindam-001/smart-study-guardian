
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showRegister, setShowRegister] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-primary mb-4">Student Portal</h1>
        <p className="text-xl text-edu-dark max-w-md">Access your courses, assignments, and grades in one place</p>
      </div>
      
      {showRegister ? (
        <RegisterForm />
      ) : (
        <>
          <LoginForm />
          <div className="mt-4 text-center">
            <p className="text-muted-foreground mb-2">New to the platform?</p>
            <Button 
              variant="outline" 
              onClick={() => setShowRegister(true)}
            >
              Register New Account
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
