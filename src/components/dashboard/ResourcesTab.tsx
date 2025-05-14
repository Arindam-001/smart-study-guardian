
import React from 'react';
import { Subject, Resource, ResourceLevel } from '@/lib/interfaces/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import RecommendationsCard from '@/components/student/RecommendationsCard';
import { Video, File, FileText, LinkIcon } from 'lucide-react';
import ResourceCard from '@/components/subjects/ResourceCard';

interface ResourcesTabProps {
  subjects: Subject[];
  selectedSubject: string | null;
  setSelectedSubject: (subjectId: string) => void;
  showAllResources: boolean;
  setShowAllResources: (show: boolean) => void;
  studentLevel: ResourceLevel;
  allResources: Resource[];
  allRecommendations: Resource[];
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ 
  subjects, 
  selectedSubject, 
  setSelectedSubject,
  showAllResources,
  setShowAllResources,
  studentLevel,
  allResources,
  allRecommendations
}) => {
  const currentSubject = subjects.find(s => s.id === selectedSubject);
  
  // Get resources of the selected subject
  const selectedSubjectResources = currentSubject?.resources || [];
  
  // Get resources by type for the selected subject
  const videoResources = selectedSubjectResources.filter(r => r.type === 'video');
  const documentResources = selectedSubjectResources.filter(r => r.type === 'document');
  const linkResources = selectedSubjectResources.filter(r => r.type === 'link');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h3 className="text-xl font-medium">Learning Resources</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="resource-mode" 
              checked={showAllResources} 
              onCheckedChange={setShowAllResources}
            />
            <Label htmlFor="resource-mode">
              {showAllResources ? "All Resources" : "Recommendations"}
            </Label>
          </div>
          
          <Select 
            value={selectedSubject || ''} 
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedSubject && (
        <RecommendationsCard 
          resources={allRecommendations} 
          studentLevel={studentLevel} 
          allResources={allResources}
          showAllResources={showAllResources}
        />
      )}

      {selectedSubject && (
        <>
          {selectedSubjectResources.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-edu-dark">No resources available for this subject</h3>
              <p className="text-muted-foreground mt-2">Check back later for updates from your instructor.</p>
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
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourcesTab;
