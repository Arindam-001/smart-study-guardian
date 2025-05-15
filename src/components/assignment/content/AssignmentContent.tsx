
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';
import AssignmentTabs from '../tabs/AssignmentTabs';
import QuestionSection from '../questions/QuestionSection';

interface AssignmentContentProps {
  assignment: Assignment;
  currentQuestionIndex: number;
  currentQuestion: any;
  answers: Record<string, string>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleAnswerChange: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextQuestion: () => void;
  handlePrevQuestion: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const AssignmentContent: React.FC<AssignmentContentProps> = ({
  assignment,
  currentQuestionIndex,
  currentQuestion,
  answers,
  activeTab,
  setActiveTab,
  handleAnswerChange,
  fileInputRef,
  handleFileChange,
  handleNextQuestion,
  handlePrevQuestion,
  setCurrentQuestionIndex,
  isSubmitting,
  onSubmit
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-edu-primary">
          {assignment.title}
          {activeTab === 'questions' && (
            <span className="ml-2">
              - Question {currentQuestionIndex + 1} of {assignment.questions.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <AssignmentTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentQuestion={currentQuestion}
          currentAnswer={answers[currentQuestion.id] || ''}
          onAnswerChange={handleAnswerChange}
          isLastQuestion={currentQuestionIndex === assignment.questions.length - 1}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
      </CardContent>
      
      <CardFooter>
        {activeTab === 'questions' ? (
          <QuestionSection 
            questions={assignment.questions}
            currentQuestionIndex={currentQuestionIndex}
            currentQuestion={currentQuestion}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
            onSelectQuestion={setCurrentQuestionIndex}
            isSubmitting={isSubmitting}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onSubmit={onSubmit}
          />
        ) : (
          <div className="w-full flex justify-end">
            <Button 
              onClick={() => setActiveTab('questions')} 
              variant="outline"
            >
              Back to Questions
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssignmentContent;
