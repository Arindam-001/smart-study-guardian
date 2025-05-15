
import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/lib/interfaces/types';
import QuestionDisplay from './QuestionDisplay';
import QuestionNavigation from './QuestionNavigation';
import FileUploadSection from '../upload/FileUploadSection';

interface QuestionSectionProps {
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question;
  answers: Record<string, string>;
  onAnswerChange: (value: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSelectQuestion: (index: number) => void;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

const QuestionSection = ({
  questions,
  currentQuestionIndex,
  currentQuestion,
  answers,
  onAnswerChange,
  onNextQuestion,
  onPrevQuestion,
  onSelectQuestion,
  isSubmitting,
  fileInputRef,
  onFileChange,
  onSubmit
}: QuestionSectionProps) => {
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    onSubmit(e);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <QuestionDisplay 
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            onAnswerChange={onAnswerChange}
          />
          
          {isLastQuestion && (
            <FileUploadSection 
              ref={fileInputRef} 
              onFileChange={onFileChange} 
            />
          )}
        </div>
        
        <div className="flex justify-between mb-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={onPrevQuestion} 
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button 
              type="submit"
              className="bg-edu-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          ) : (
            <Button 
              type="button"
              variant="default" 
              onClick={onNextQuestion} 
              className="bg-edu-primary"
            >
              Next
            </Button>
          )}
        </div>
      </form>
      
      <QuestionNavigation 
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        onSelectQuestion={onSelectQuestion}
      />
    </div>
  );
};

export default QuestionSection;
