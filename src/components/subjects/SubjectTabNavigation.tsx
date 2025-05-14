
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, File, AlertTriangle, FileText } from 'lucide-react';

interface SubjectTabNavigationProps {
  hasWarnings: boolean;
}

const SubjectTabNavigation: React.FC<SubjectTabNavigationProps> = ({ hasWarnings }) => {
  return (
    <TabsList>
      <TabsTrigger value="notes" className="flex items-center gap-2">
        <BookOpen size={16} />
        <span>Notes</span>
      </TabsTrigger>
      <TabsTrigger value="resources" className="flex items-center gap-2">
        <FileText size={16} />
        <span>Resources</span>
      </TabsTrigger>
      <TabsTrigger value="assignments" className="flex items-center gap-2 relative">
        <File size={16} />
        <span>Assignments</span>
        {hasWarnings && (
          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
            <AlertTriangle size={10} />
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );
};

export default SubjectTabNavigation;
