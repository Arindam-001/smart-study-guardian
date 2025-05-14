
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Question } from '@/lib/interfaces/types';
import QuestionDisplay from '../questions/QuestionDisplay';
import AssignmentEditor from '../AssignmentEditor';
import FileUploadSection from '../upload/FileUploadSection';

interface AssignmentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentQuestion: Question;
  currentAnswer: string;
  onAnswerChange: (value: string) => void;
  isLastQuestion: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AssignmentTabs = ({
  activeTab,
  setActiveTab,
  currentQuestion,
  currentAnswer,
  onAnswerChange,
  isLastQuestion,
  fileInputRef,
  onFileChange
}: AssignmentTabsProps) => {
  return (
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
        <QuestionDisplay 
          question={currentQuestion}
          answer={currentAnswer}
          onAnswerChange={onAnswerChange}
        />
        
        {isLastQuestion && (
          <FileUploadSection 
            ref={fileInputRef} 
            onFileChange={onFileChange} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="word">
        <AssignmentEditor onClose={() => setActiveTab('questions')} type="word" />
      </TabsContent>
      
      <TabsContent value="ppt">
        <AssignmentEditor onClose={() => setActiveTab('questions')} type="powerpoint" />
      </TabsContent>
    </Tabs>
  );
};

export default AssignmentTabs;
