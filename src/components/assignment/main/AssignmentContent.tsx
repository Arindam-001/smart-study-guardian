
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment, Question } from '@/lib/interfaces/types';
import AssignmentTabs from '../tabs/AssignmentTabs';
import QuestionSection from '../questions/QuestionSection';

interface AssignmentContentProps {
  assignment: Assignment;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentQuestion: Question;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  handleAnswerChange: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextQuestion: () => void;
  handlePrevQuestion: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  isSubmitting: boolean;
  handleSubmit: (autoSubmitted: boolean) => void;
}

const AssignmentContent = ({
  assignment,
  activeTab,
  setActiveTab,
  currentQuestion,
  currentQuestionIndex,
  answers,
  handleAnswerChange,
  fileInputRef,
  handleFileChange,
  handleNextQuestion,
  handlePrevQuestion,
  setCurrentQuestionIndex,
  isSubmitting,
  handleSubmit
}: AssignmentContentProps) => {
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
            onSubmit={() => handleSubmit(false)}
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
