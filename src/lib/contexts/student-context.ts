
import { Warning, StudentPerformance } from '@/lib/interfaces/types';

// Student-related context functions
export const useStudentFunctions = (
  setUsers: React.Dispatch<React.SetStateAction<any[]>>,
  setWarnings: React.Dispatch<React.SetStateAction<Warning[]>>,
  studentPerformanceList: StudentPerformance[]
) => {
  // Add warning function
  const addWarning = (studentId: string, assignmentId: string, reason: string): Warning => {
    const newWarning: Warning = {
      id: `warning_${Date.now()}`,
      studentId,
      assignmentId,
      reason,
      timestamp: new Date(),
    };
    
    setWarnings(prev => [...prev, newWarning]);
    return newWarning;
  };

  // Grant semester access function
  const grantSemesterAccess = (studentId: string, semesterId: number): boolean => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === studentId
          ? { 
              ...u, 
              accessibleSemesters: 
                u.accessibleSemesters.includes(semesterId)
                  ? u.accessibleSemesters
                  : [...u.accessibleSemesters, semesterId] 
            }
          : u
      )
    );
    return true;
  };

  // Update attendance function
  const updateAttendance = (studentId: string, subjectId: string, present: boolean, date?: Date): boolean => {
    setUsers(prevUsers => 
      prevUsers.map(u => {
        if (u.id !== studentId) return u;
        
        const attendance = u.attendance || {};
        const subjectAttendance = attendance[subjectId] || [];
        
        // Find the index of the date, or use length if not found
        const dateIndex = subjectAttendance.length;
        
        const newSubjectAttendance = [...subjectAttendance];
        newSubjectAttendance[dateIndex] = present;
        
        return {
          ...u,
          attendance: {
            ...attendance,
            [subjectId]: newSubjectAttendance
          }
        };
      })
    );
    return true;
  };

  // Get student performance function
  const getStudentPerformance = (studentId: string): StudentPerformance[] => {
    return studentPerformanceList.filter(p => p.studentId === studentId);
  };

  return { 
    addWarning, 
    grantSemesterAccess, 
    updateAttendance, 
    getStudentPerformance 
  };
};
