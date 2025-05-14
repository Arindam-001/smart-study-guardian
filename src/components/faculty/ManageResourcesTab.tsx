
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Resource } from '@/lib/interfaces/types';
import AddResourceDialog from '@/components/resources/AddResourceDialog';
import BulkUploadDialog from '@/components/resources/BulkUploadDialog';
import { Plus, Upload, Trash2 } from 'lucide-react';

interface ManageResourcesTabProps {
  selectedSubject: string;
  onResourceAdded: () => void;
}

const ManageResourcesTab: React.FC<ManageResourcesTabProps> = ({ 
  selectedSubject,
  onResourceAdded
}) => {
  const { subjects, addResource, deleteResource } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  
  const subject = subjects.find(s => s.id === selectedSubject);
  const subjectResources = subject?.resources || [];
  
  const handleResourceAdded = (resource: Partial<Resource>) => {
    if (resource.title && resource.url && resource.type) {
      // Call addResource with the correct number of arguments: subjectId, title, url, type
      addResource(selectedSubject, resource.title, resource.url, resource.type);
      onResourceAdded();
    }
    setIsAddDialogOpen(false);
  };
  
  const handleBulkUpload = (resources: Partial<Resource>[]) => {
    resources.forEach(resource => {
      if (resource.title && resource.url && resource.type) {
        // Call addResource with correct arguments
        addResource(selectedSubject, resource.title, resource.url, resource.type);
      }
    });
    
    onResourceAdded();
  };
  
  // Fixed: Changed parameter type to match expected string type for resourceId
  const handleDeleteResource = (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource(selectedSubject, resourceId);
    }
  };

  
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-medium">Resources</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>
      
      {subjectResources.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No resources added yet.</p>
          <Button 
            variant="link" 
            onClick={() => setIsAddDialogOpen(true)}
            className="mt-2"
          >
            Add your first resource
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {subjectResources.map(resource => (
            <div 
              key={resource.id}
              className="border rounded-md p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{resource.title}</div>
                <div className="text-sm text-muted-foreground">
                  {resource.type} • {resource.level} • {resource.topic}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a 
                  href={resource.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </a>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteResource(resource.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <AddResourceDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onResourceAdded={handleResourceAdded}
        subjectId={selectedSubject}
        onClose={() => setIsAddDialogOpen(false)}
      />
      
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadComplete={handleBulkUpload}
      />
    </div>
  );
};

export default ManageResourcesTab;
