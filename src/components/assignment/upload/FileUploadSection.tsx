
import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';

interface FileUploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection = forwardRef<HTMLInputElement, FileUploadSectionProps>(
  ({ onFileChange }, ref) => {
    return (
      <div className="mt-6 border-t pt-4">
        <h4 className="font-medium mb-2">Upload Assignment Document (Optional)</h4>
        <div className="flex flex-col space-y-2">
          <Input 
            type="file" 
            ref={ref}
            onChange={onFileChange}
            accept=".pdf,.doc,.docx" 
          />
          <p className="text-xs text-muted-foreground">
            You can submit without uploading a document. Your answers will be saved automatically.
          </p>
        </div>
      </div>
    );
  }
);

FileUploadSection.displayName = 'FileUploadSection';

export default FileUploadSection;
