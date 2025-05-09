
import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/lib/context';

interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  onSelectQuestion: (index: number) => void;
}

const QuestionNavigation = ({
  questions,
  currentQuestionIndex,
  answers,
  onSelectQuestion
}: QuestionNavigationProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, idx) => (
        <Button
          key={q.id}
          variant={idx === currentQuestionIndex ? "default" : answers[q.id] ? "outline" : "secondary"}
          className={`w-full ${idx === currentQuestionIndex ? "bg-edu-primary" : answers[q.id] ? "border-edu-primary" : ""}`}
          onClick={() => onSelectQuestion(idx)}
        >
          {idx + 1}
        </Button>
      ))}
    </div>
  );
};

export default QuestionNavigation;
