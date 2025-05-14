
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AssignmentFormConfigProps {
  title: string;
  setTitle: (title: string) => void;
  dueDate: Date;
  setDueDate: (date: Date | undefined) => void;
  questionCount: string;
  setQuestionCount: (count: string) => void;
  enableProctoring: boolean;
  setEnableProctoring: (enable: boolean) => void;
}

const AssignmentFormConfig: React.FC<AssignmentFormConfigProps> = ({
  title,
  setTitle,
  dueDate,
  setDueDate,
  questionCount,
  setQuestionCount,
  enableProctoring,
  setEnableProctoring
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Assignment Title</Label>
        <Input
          id="title"
          placeholder="Enter assignment title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Due Date</Label>
          <DatePicker date={dueDate} setDate={setDueDate} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="questions">Number of Questions</Label>
          <Select value={questionCount} onValueChange={setQuestionCount}>
            <SelectTrigger>
              <SelectValue placeholder="20 Questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
              <SelectItem value="20">20 Questions</SelectItem>
              <SelectItem value="25">25 Questions</SelectItem>
              <SelectItem value="30">30 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="proctoring"
          checked={enableProctoring}
          onCheckedChange={() => setEnableProctoring(!enableProctoring)}
        />
        <label
          htmlFor="proctoring"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Enable proctoring (camera monitoring, tab switching detection)
        </label>
      </div>
    </div>
  );
};

export default AssignmentFormConfig;
