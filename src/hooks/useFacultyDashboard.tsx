
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { getItem, setItem } from '@/lib/local-storage';
import { User, Subject } from '@/lib/interfaces/types';

const FACULTY_STORAGE_KEY = 'FACULTY_DASHBOARD_STATE';

export function useFacultyDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const impersonateId = searchParams.get('id');

  const { user, subjects, users } = useAppContext();
  const { toast } = useToast();
  
  // Load state from localStorage or use defaults
  const savedState = getItem<{
    selectedSubject: string | null;
    activeTab: string;
  }>(FACULTY_STORAGE_KEY, {
    selectedSubject: null,
    activeTab: 'resources'
  });
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(savedState.selectedSubject);
  const [activeTab, setActiveTab] = useState<string>(savedState.activeTab);
  
  // Get the actual user - either the logged-in user or the impersonated user
  const actualUser = impersonateId && user?.role === 'admin' 
    ? users.find(u => u.id === impersonateId && u.role === 'teacher')
    : user;

  // Get subjects taught by this faculty member
  const taughtSubjects = subjects.filter(s => s.teacherId === actualUser?.id);
  
  // Get all students
  const students = users.filter(u => u.role === 'student');
  
  // Effect to set a default subject if none selected
  useEffect(() => {
    if (taughtSubjects.length > 0 && !selectedSubject) {
      const defaultSubject = taughtSubjects[0].id;
      setSelectedSubject(defaultSubject);
      
      // Save to localStorage
      setItem(FACULTY_STORAGE_KEY, {
        selectedSubject: defaultSubject,
        activeTab
      });
    }
  }, [taughtSubjects, selectedSubject, activeTab]);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    if (selectedSubject) {
      setItem(FACULTY_STORAGE_KEY, {
        selectedSubject,
        activeTab
      });
    }
  }, [selectedSubject, activeTab]);

  // Function to handle resource added notification
  const handleResourceAdded = () => {
    toast({
      title: "Resource Added",
      description: "Students can now access this resource",
    });
  };

  // Function to handle note added notification
  const handleNoteAdded = () => {
    toast({
      title: "Note Added",
      description: "Students can now access this note",
    });
  };
  
  // Function to handle assignment added notification
  const handleAssignmentAdded = () => {
    toast({
      title: "Assignment Added",
      description: "Students can now access this assignment",
    });
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const notes = currentSubject?.notes || [];

  return {
    actualUser,
    impersonateId,
    user,
    taughtSubjects,
    selectedSubject,
    setSelectedSubject,
    activeTab,
    handleTabChange,
    students,
    currentSubject,
    notes,
    handleResourceAdded,
    handleNoteAdded,
    handleAssignmentAdded
  };
}
