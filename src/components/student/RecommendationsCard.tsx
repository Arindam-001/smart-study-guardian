
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/lib/context';
import { BookOpen, Video, Link } from 'lucide-react';

interface RecommendationsCardProps {
  resources: Resource[];
}

const RecommendationsCard = ({ resources }: RecommendationsCardProps) => {
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

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recommended Resources</CardTitle>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations available yet. Complete an assignment to get personalized recommendations.</p>
        ) : (
          <ul className="space-y-3">
            {resources.map(resource => (
              <li key={resource.id} className="border rounded-md p-3">
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
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-edu-primary hover:underline"
                    >
                      View Resource
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
