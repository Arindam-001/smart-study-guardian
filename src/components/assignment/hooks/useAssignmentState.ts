
import { useState, useRef } from 'react';
import { Assignment, Question } from '@/lib/interfaces/types';

export const useAssignmentState = (assignment: Assignment) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('questions');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentQuestion = assignment.questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    file,
    setFile,
    activeTab,
    setActiveTab,
    fileInputRef,
    currentQuestion,
    handleAnswerChange,
    handleFileChange,
    handleNextQuestion,
    handlePrevQuestion
  };
};
