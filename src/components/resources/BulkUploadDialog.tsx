
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Resource } from '@/lib/interfaces/types';
import { AlertCircle, Check, X, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BulkUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (resources: Partial<Resource>[]) => void;
}

interface ResourceTemplate {
  title: string;
  description?: string;
  url: string;
  type: 'video' | 'document' | 'link';
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ open, onClose, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedResources, setParsedResources] = useState<ResourceTemplate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'csv' | 'file'>('csv');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const resetForm = () => {
    setFile(null);
    setParsedResources([]);
    setParseError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (filesInputRef.current) {
      filesInputRef.current.value = '';
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setParseError(null);
    }
  };

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      const resources: ResourceTemplate[] = fileList.map(file => {
        // Generate a URL for the file
        const fileUrl = URL.createObjectURL(file);
        
        // Determine file type
        let fileType: 'video' | 'document' | 'link' = 'document';
        if (file.type.startsWith('video/')) {
          fileType = 'video';
        } else if (file.type.startsWith('application/') || file.type.startsWith('text/')) {
          fileType = 'document';
        }
        
        return {
          title: file.name,
          url: fileUrl,
          type: fileType,
          level: 'beginner',
          topic: 'General',
          description: `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
        };
      });
      
      setParsedResources(resources);
      
      toast({
        title: `${resources.length} files processed`,
        description: "Files are ready to be uploaded as resources"
      });
    }
  };
  
  const parseCSV = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setParseError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Check header
        const header = lines[0].trim().split(',');
        const requiredFields = ['title', 'url', 'type', 'level', 'topic'];
        
        for (const field of requiredFields) {
          if (!header.includes(field)) {
            setParseError(`Missing required field in CSV header: ${field}`);
            setIsProcessing(false);
            return;
          }
        }
        
        const resources: ResourceTemplate[] = [];
        
        // Parse each line
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length < requiredFields.length) continue;
          
          const resource: any = {};
          
          header.forEach((field, index) => {
            if (index < values.length) {
              resource[field.trim()] = values[index].trim();
            }
          });
          
          // Validate resource data
          const validTypes = ['video', 'document', 'link'];
          const validLevels = ['beginner', 'intermediate', 'advanced'];
          
          if (!resource.title || !resource.url) continue;
          if (!validTypes.includes(resource.type)) resource.type = 'link';
          if (!validLevels.includes(resource.level)) resource.level = 'beginner';
          
          resources.push(resource);
        }
        
        setParsedResources(resources);
        
        if (resources.length === 0) {
          setParseError('No valid resources found in CSV file.');
        }
      } catch (error) {
        setParseError('Error parsing CSV file. Please check the format.');
        console.error('Error parsing CSV:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setParseError('Error reading file. Please try again.');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleUpload = () => {
    if (parsedResources.length === 0) {
      toast({
        title: "No resources to upload",
        description: "Please upload files or a valid CSV file with resource data.",
        variant: "destructive",
      });
      return;
    }
    
    onUploadComplete(parsedResources);
    toast({
      title: "Resources uploaded",
      description: `Successfully added ${parsedResources.length} resources.`,
    });
    resetForm();
    onClose();
  };
  
  const handleDialogClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Resources</DialogTitle>
          <DialogDescription>
            Upload multiple resources at once using files or a CSV template.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={uploadMode === 'file' ? "default" : "outline"} 
              onClick={() => setUploadMode('file')}
              className="flex-1"
            >
              Upload Files
            </Button>
            <Button 
              variant={uploadMode === 'csv' ? "default" : "outline"} 
              onClick={() => setUploadMode('csv')}
              className="flex-1"
            >
              CSV Template
            </Button>
          </div>

          {uploadMode === 'file' ? (
            <div className="space-y-2">
              <Label htmlFor="files-upload">Upload Files</Label>
              <Input 
                ref={filesInputRef}
                id="files-upload" 
                type="file" 
                multiple
                onChange={handleFilesUpload} 
                className="cursor-pointer"
              />
              <div className="text-xs text-muted-foreground">
                Select any files you want to upload as resources (documents, videos, etc.)
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input 
                  ref={fileInputRef}
                  id="csv-file" 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <div className="text-xs text-muted-foreground">
                  File must be a CSV with headers: title, url, type, level, topic
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="secondary" 
                onClick={parseCSV}
                disabled={!file || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Parse CSV File'}
              </Button>
            </>
          )}
          
          {parseError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>{parseError}</div>
            </div>
          )}
          
          {parsedResources.length > 0 && (
            <div className="border rounded-md">
              <div className="p-3 bg-muted/50 border-b">
                <div className="font-medium">{parsedResources.length} Resources Found</div>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Title</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>Topic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedResources.map((resource, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.type}</TableCell>
                        <TableCell>{resource.topic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={parsedResources.length === 0 || isProcessing}
          >
            Upload {parsedResources.length} Resources
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
