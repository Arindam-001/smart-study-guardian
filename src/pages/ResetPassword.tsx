
import React from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-edu-primary mb-4">Reset Password</h1>
        <p className="text-xl text-edu-dark max-w-md">Create a new secure password for your account.</p>
      </div>
      
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
