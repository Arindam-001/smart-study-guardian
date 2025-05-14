
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentFieldsProps {
  enrolledCourse: string;
  setEnrolledCourse: (value: string) => void;
  currentSemester: number;
  setCurrentSemester: (value: number) => void;
  maxSemesters: number[];
}

export const StudentFields: React.FC<StudentFieldsProps> = ({
  enrolledCourse,
  setEnrolledCourse,
  currentSemester,
  setCurrentSemester,
  maxSemesters
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="enrolled-course">Enrolled Course</Label>
        <Input
          id="enrolled-course"
          placeholder="e.g., B.Tech, BCA, MBBS, B.Sc"
          value={enrolledCourse}
          onChange={(e) => setEnrolledCourse(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">Course name determines available semesters</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="semester">Current Semester</Label>
        <Select 
          value={currentSemester.toString()} 
          onValueChange={(value) => setCurrentSemester(parseInt(value, 10))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {maxSemesters.map(semester => (
              <SelectItem key={semester} value={semester.toString()}>
                Semester {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Total semesters: {maxSemesters.length}</p>
      </div>
    </>
  );
};

export default StudentFields;
