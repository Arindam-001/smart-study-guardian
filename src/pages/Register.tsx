
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-primary mb-4">Student Portal</h1>
        <p className="text-xl text-edu-dark max-w-md">Register for an account to access your courses</p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default Register;
