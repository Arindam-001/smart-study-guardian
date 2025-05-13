
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/lib/interfaces/types';
import { BookOpen, Video, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RecommendationsCardProps {
  resources: Resource[];
  studentLevel?: 'beginner' | 'intermediate' | 'advanced';
  allResources?: Resource[];
  showAllResources?: boolean;
}

const RecommendationsCard = ({ 
  resources, 
  studentLevel = 'beginner',
  allResources = [],
  showAllResources = false
}: RecommendationsCardProps) => {
  const [selectedResource, setSelectedResource] = React.useState<Resource | null>(null);
  
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
      case 'link': return <LinkIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  // Display resources based on mode
  const displayResources = showAllResources ? allResources : resources;

  // AI recommendation algorithm - filter resources based on student level and type
  const filteredResources = !showAllResources ? displayResources.filter(resource => {
    if (studentLevel === 'beginner') {
      // Beginner students get mostly beginner resources with some intermediate ones for growth
      return resource.level === 'beginner' || (Math.random() < 0.2 && resource.level === 'intermediate');
    } else if (studentLevel === 'intermediate') {
      // Intermediate students get a mix of beginner and intermediate resources,
      // with occasional advanced resources for challenge
      if (resource.level === 'advanced') {
        return Math.random() < 0.3; // 30% chance of getting advanced resources
      }
      return resource.level === 'beginner' || resource.level === 'intermediate';
    } else {
      // Advanced students get all resources, prioritizing advanced ones
      return true;
    }
  }) : displayResources;

  // Further filter by type if needed
  const renderResourceItem = (resource: Resource) => (
    <li 
      key={resource.id} 
      className="border rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedResource(resource)}
    >
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
          <span 
            className="text-xs text-edu-primary hover:underline inline-flex items-center"
          >
            View Resource <span className="ml-1">→</span>
          </span>
        </div>
      </div>
    </li>
  );

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <span>{showAllResources ? "All Subject Resources" : "AI Recommended Resources"}</span>
            {!showAllResources && studentLevel && (
              <Badge className={getLevelColor(studentLevel)}>
                {studentLevel.charAt(0).toUpperCase() + studentLevel.slice(1)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <p className="text-sm text-gray-500">
              {showAllResources 
                ? "No resources available for your subjects yet." 
                : "No recommendations available yet. Complete an assignment to get personalized recommendations."
              }
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredResources.map(resource => renderResourceItem(resource))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="max-w-4xl">
          {selectedResource && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedResource.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {selectedResource.type === 'video' ? (
                  <div className="aspect-video">
                    <iframe 
                      src={selectedResource.url} 
                      className="w-full h-full rounded-md" 
                      title={selectedResource.title}
                      allowFullScreen
                    />
                  </div>
                ) : selectedResource.type === 'document' ? (
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="text-sm">Document content not available for preview.</p>
                    <a 
                      href={selectedResource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-edu-primary hover:underline mt-2 inline-block"
                    >
                      Open Document
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <a 
                      href={selectedResource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-edu-primary hover:underline text-lg"
                    >
                      Open External Resource
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecommendationsCard;
