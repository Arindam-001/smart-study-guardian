
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/lib/interfaces/types';

interface QuestionDisplayProps {
  question: Question;
  answer: string;
  onAnswerChange: (value: string) => void;
}

const QuestionDisplay = ({
  question,
  answer,
  onAnswerChange
}: QuestionDisplayProps) => {
  return (
    <div className="mb-4">
      <p className="text-lg font-medium mb-4">{question.text}</p>
      
      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            // Handle both string options and object options with id and text properties
            const optionValue = typeof option === 'object' && option !== null ? 
              (option.id || option.text || '') : 
              option;
            const optionText = typeof option === 'object' && option !== null ? 
              (option.text || option.id || '') : 
              option;
            
            return (
              <label key={idx} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  checked={answer === optionValue}
                  onChange={() => onAnswerChange(optionValue)}
                />
                <span>{optionText}</span>
              </label>
            );
          })}
        </div>
      )}
      
      {question.type === 'text' && (
        <Textarea
          value={answer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={5}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
