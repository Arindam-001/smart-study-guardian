
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Resource } from '@/lib/interfaces/types';
import { LinkIcon, Video, FileText } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  type: 'video' | 'document' | 'link';
  onDelete?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, type, onDelete }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{resource.title}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs ${getLevelColor(resource.level)}`}>
            {resource.level}
          </div>
        </div>
        <CardDescription>{resource.description || `${type} resource on ${resource.topic}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Topic:</span> {resource.topic}
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-edu-primary hover:underline"
            >
              {getTypeIcon()}
              <span className="ml-1">Access Resource</span>
            </a>
            
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700" 
                onClick={onDelete}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
