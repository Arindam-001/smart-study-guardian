
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Upload, BookOpen, Video, Play, Link as LinkIcon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Resource } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';

interface ManageResourcesTabProps {
  selectedSubject: string | null;
}

const ManageResourcesTab: React.FC<ManageResourcesTabProps> = ({ selectedSubject }) => {
  const { addResource, subjects } = useAppContext();
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState<'video' | 'link' | 'document'>('video');
  const [resourceLevel, setResourceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [resourceTopic, setResourceTopic] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  
  // Separate resources by type
  const videoResources = currentSubject?.resources?.filter(r => r.type === 'video') || [];
  const documentResources = currentSubject?.resources?.filter(r => r.type === 'document') || [];
  const linkResources = currentSubject?.resources?.filter(r => r.type === 'link') || [];

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive"
      });
      return;
    }

    if (!resourceTitle || !resourceUrl || !resourceTopic) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addResource(selectedSubject, {
      title: resourceTitle,
      url: resourceUrl,
      type: resourceType,
      level: resourceLevel,
      topic: resourceTopic,
    });

    toast({
      title: "Success",
      description: "Resource added successfully"
    });

    // Reset form
    setResourceTitle('');
    setResourceUrl('');
    setResourceTopic('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Create placeholder URLs for file previews
      if (newFiles.length > 0) {
        const file = newFiles[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setResourceUrl(e.target?.result as string);
            setResourceType('document');
          };
          reader.readAsDataURL(file);
        } else {
          setResourceUrl(URL.createObjectURL(file));
          setResourceType(file.type.includes('video') ? 'video' : 'document');
        }
        // Set title from filename if empty
        if (resourceTitle === '') {
          setResourceTitle(file.name.split('.')[0]);
        }
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    if (selectedFiles.length <= 1) {
      setResourceUrl('');
    }
  };

  return (
    <>
      <form onSubmit={handleResourceSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="resource-title">Resource Title</Label>
            <Input
              id="resource-title"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              placeholder="Introduction to Variables"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resource-url">Resource URL or Upload</Label>
            <div className="flex gap-2">
              <Input
                id="resource-url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://example.com/resource"
                className="flex-1"
                required={selectedFiles.length === 0}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleUploadClick}
                className="flex-shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </div>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="border rounded-md p-3 space-y-2">
            <h4 className="text-sm font-medium">Selected Files:</h4>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSelectedFile(index)}
                    className="h-6 w-6 p-0 text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="resource-type">Resource Type</Label>
            <Select 
              value={resourceType} 
              onValueChange={(v) => setResourceType(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resource-level">Difficulty Level</Label>
            <Select 
              value={resourceLevel} 
              onValueChange={(v) => setResourceLevel(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resource-topic">Topic</Label>
            <Input
              id="resource-topic"
              value={resourceTopic}
              onChange={(e) => setResourceTopic(e.target.value)}
              placeholder="programming basics"
              required
            />
          </div>
        </div>

        <Button type="submit" className="mt-4">
          <FileUp className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </form>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Video Resources
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoResources.length > 0 ? videoResources.map(resource => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>
                    <span className="capitalize">{resource.level}</span>
                  </TableCell>
                  <TableCell>{resource.topic}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedResource(resource)}
                      className="flex items-center"
                    >
                      <Play className="h-3 w-3 mr-1" /> Preview
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No video resources added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Document Resources
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentResources.length > 0 ? documentResources.map(resource => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>
                    <span className="capitalize">{resource.level}</span>
                  </TableCell>
                  <TableCell>{resource.topic}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedResource(resource)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No document resources added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2" />
            Link Resources
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkResources.length > 0 ? linkResources.map(resource => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>
                    <span className="capitalize">{resource.level}</span>
                  </TableCell>
                  <TableCell>{resource.topic}</TableCell>
                  <TableCell>
                    <a 
                      href={resource.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-edu-primary underline"
                    >
                      Open Link
                    </a>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No link resources added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Resource Preview Dialog */}
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
                    <p className="text-sm">{selectedResource.description || "Document content not available for preview."}</p>
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

export default ManageResourcesTab;
