
import React from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/components/ui/use-toast';
import { Subject } from '@/lib/interfaces/types';
import { Video, FileText, LinkIcon } from 'lucide-react';
import ResourceCard from './ResourceCard';

interface ResourcesTabProps {
  subject: Subject;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ subject }) => {
  const { user, deleteResource } = useAppContext();
  const { toast } = useToast();
  
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  
  // Get resources by type
  const videoResources = subject.resources?.filter(r => r.type === 'video') || [];
  const documentResources = subject.resources?.filter(r => r.type === 'document') || [];
  const linkResources = subject.resources?.filter(r => r.type === 'link') || [];
  
  // Handle resource deletion
  const handleDeleteResource = (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteResource(subject.id, resourceId);
      toast({
        title: "Resource deleted",
        description: "The resource has been successfully deleted."
      });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-4">Learning Resources</h3>
      
      {(!subject.resources || subject.resources.length === 0) ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-edu-dark">No resources available for this subject yet.</h3>
          {isTeacherOrAdmin && (
            <p className="text-muted-foreground mt-2">
              Please add resources in the Faculty Dashboard.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Video Resources */}
          {videoResources.length > 0 && (
            <div>
              <h4 className="text-lg font-medium mb-3 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Video Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    type="video"
                    onDelete={isTeacherOrAdmin ? () => handleDeleteResource(resource.id) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Document Resources */}
          {documentResources.length > 0 && (
            <div>
              <h4 className="text-lg font-medium mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    type="document"
                    onDelete={isTeacherOrAdmin ? () => handleDeleteResource(resource.id) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Link Resources */}
          {linkResources.length > 0 && (
            <div>
              <h4 className="text-lg font-medium mb-3 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                Web Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {linkResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    type="link"
                    onDelete={isTeacherOrAdmin ? () => handleDeleteResource(resource.id) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;
