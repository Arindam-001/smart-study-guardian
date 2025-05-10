
import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/lib/interfaces/types';
import { Check, X, HelpCircle } from 'lucide-react';

interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  onSelectQuestion: (index: number) => void;
  correctAnswers?: Record<string, boolean>; // Track if answers are correct
}

const QuestionNavigation = ({
  questions,
  currentQuestionIndex,
  answers,
  onSelectQuestion,
  correctAnswers
}: QuestionNavigationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-700">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          // Determine button styling based on answer status
          const isCurrentQuestion = idx === currentQuestionIndex;
          let variant: "default" | "outline" | "secondary" | "destructive" | "success" = isCurrentQuestion ? "default" : "secondary";
          let icon = null;
          
          if (answers[q.id]) {
            if (correctAnswers) {
              // If we know if the answer is correct
              if (correctAnswers[q.id]) {
                variant = isCurrentQuestion ? "default" : "outline";
                icon = <Check size={16} className="text-green-500" />;
              } else {
                variant = isCurrentQuestion ? "default" : "destructive";
                icon = <X size={16} className="text-red-500" />;
              }
            } else {
              // Just know it's answered but not if correct
              variant = isCurrentQuestion ? "default" : "outline";
              icon = <HelpCircle size={16} className="text-edu-primary" />;
            }
          }
          
          return (
            <Button
              key={q.id}
              variant={variant}
              className={`w-full flex items-center justify-center gap-1 ${
                isCurrentQuestion ? "bg-edu-primary" : 
                answers[q.id] ? "border-edu-primary" : ""
              }`}
              onClick={() => onSelectQuestion(idx)}
            >
              <span>{idx + 1}</span>
              {icon && <span className="ml-1">{icon}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigation;
