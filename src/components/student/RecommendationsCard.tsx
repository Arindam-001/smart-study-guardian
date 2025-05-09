
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/lib/context';
import { BookOpen, Video, Link } from 'lucide-react';

interface RecommendationsCardProps {
  resources: Resource[];
  studentLevel?: 'beginner' | 'intermediate' | 'advanced';
}

const RecommendationsCard = ({ resources, studentLevel = 'beginner' }: RecommendationsCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <BookOpen className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      default: return null;
    }
  };

  // Filter resources based on student level
  const filteredResources = resources.filter(resource => {
    if (studentLevel === 'beginner') {
      // Beginner students get beginner resources
      return resource.level === 'beginner';
    } else if (studentLevel === 'intermediate') {
      // Intermediate students get beginner and intermediate resources
      return resource.level === 'beginner' || resource.level === 'intermediate';
    } else {
      // Advanced students get all resources
      return true;
    }
  });

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Recommended Resources</span>
          {studentLevel && (
            <Badge className={getLevelColor(studentLevel)}>
              {studentLevel.charAt(0).toUpperCase() + studentLevel.slice(1)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredResources.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations available yet. Complete an assignment to get personalized recommendations.</p>
        ) : (
          <ul className="space-y-3">
            {filteredResources.map(resource => (
              <li key={resource.id} className="border rounded-md p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{resource.title}</h4>
                      <Badge variant="outline" className={getLevelColor(resource.level)}>
                        {resource.level}
                      </Badge>
                    </div>
                    {resource.topic && (
                      <div className="mb-1">
                        <span className="text-xs text-gray-500">Topic: {resource.topic}</span>
                      </div>
                    )}
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-edu-primary hover:underline inline-flex items-center"
                    >
                      View Resource <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
