
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Resource } from '@/lib/interfaces/types';
import { LinkIcon, FileText, Video } from 'lucide-react';

interface ResourceSelectionListProps {
  resources: Resource[];
  selectedResources: string[];
  onResourceToggle: (resourceId: string) => void;
}

const ResourceSelectionList: React.FC<ResourceSelectionListProps> = ({
  resources,
  selectedResources,
  onResourceToggle,
}) => {
  // Group resources by type for better organization
  const videoResources = resources.filter(r => r.type === 'video');
  const documentResources = resources.filter(r => r.type === 'document');
  const linkResources = resources.filter(r => r.type === 'link');

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500 mr-1" />;
      case 'document':
        return <FileText className="h-4 w-4 text-green-500 mr-1" />;
      case 'link':
        return <LinkIcon className="h-4 w-4 text-purple-500 mr-1" />;
      default:
        return null;
    }
  };

  const renderResourceGroup = (resourceList: Resource[], groupTitle: string) => {
    if (resourceList.length === 0) return null;
    
    return (
      <div className="mb-3">
        <p className="text-sm font-medium mb-2">{groupTitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {resourceList.map(resource => (
            <div
              key={resource.id}
              className={`flex items-start p-2 border rounded hover:bg-muted transition-colors cursor-pointer ${
                selectedResources.includes(resource.id) ? 'bg-primary/10 border-primary' : ''
              }`}
              onClick={() => onResourceToggle(resource.id)}
            >
              <Checkbox 
                checked={selectedResources.includes(resource.id)}
                className="mt-1 mr-2"
                onCheckedChange={() => {}}
              />
              <div className="space-y-1">
                <div className="flex items-center">
                  {getIconForType(resource.type)}
                  <p className="font-medium text-sm">{resource.title}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {resource.topic}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Select Resources to Generate From</Label>
        <span className="text-xs text-muted-foreground">
          {selectedResources.length} selected
        </span>
      </div>
      
      <div className="max-h-56 overflow-y-auto p-1">
        {resources.length > 0 ? (
          <div>
            {renderResourceGroup(videoResources, "Video Resources")}
            {renderResourceGroup(documentResources, "Document Resources")}
            {renderResourceGroup(linkResources, "Web Resources")}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No resources available. Add some resources first.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceSelectionList;
