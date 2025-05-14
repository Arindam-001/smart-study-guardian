
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CommonFields } from './form-fields/CommonFields';
import { StudentFields } from './form-fields/StudentFields';
import { useRegistrationForm } from './hooks/useRegistrationForm';

export const RegisterForm = () => {
  const { formState, handlers } = useRegistrationForm();
  const { 
    name, setName,
    email, setEmail,
    password, setPassword, 
    phone, setPhone,
    id, setId,
    enrolledCourse, 
    role, setRole,
    currentSemester,
    isLoading,
    maxSemesters
  } = formState;
  
  const { 
    handleEnrolledCourseChange,
    handleRoleChange,
    handleSubmit
  } = handlers;

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
          <CommonFields
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            id={id}
            setId={setId}
            password={password}
            setPassword={setPassword}
            role={role}
            setRole={handleRoleChange}
          />
          
          {role === 'student' && (
            <StudentFields
              enrolledCourse={enrolledCourse}
              setEnrolledCourse={handleEnrolledCourseChange}
              currentSemester={currentSemester}
              setCurrentSemester={formState.setCurrentSemester}
              maxSemesters={maxSemesters}
            />
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
