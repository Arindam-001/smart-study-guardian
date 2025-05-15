
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, FileText } from 'lucide-react';
import { Assignment, Question } from '@/lib/interfaces/types';
import AssignmentEditor from '../AssignmentEditor';
import QuestionSection from '../questions/QuestionSection';

interface AssignmentContentProps {
  assignment: Assignment;
  currentQuestionIndex: number;
  currentQuestion: Question;
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
  onSubmit: (e?: React.FormEvent) => void;
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
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{assignment.title}</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="word" className="flex items-center gap-1">
            <File className="h-4 w-4" />MS Word
          </TabsTrigger>
          <TabsTrigger value="ppt" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />MS PowerPoint
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions">
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
        </TabsContent>
        
        <TabsContent value="word">
          <AssignmentEditor onClose={() => setActiveTab('questions')} type="word" />
        </TabsContent>
        
        <TabsContent value="ppt">
          <AssignmentEditor onClose={() => setActiveTab('questions')} type="powerpoint" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignmentContent;
