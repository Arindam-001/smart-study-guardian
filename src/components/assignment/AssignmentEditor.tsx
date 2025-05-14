
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditIcon, FileText, Save, AlertTriangle } from 'lucide-react';
import { useProctoring } from './hooks/useProctoring';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';

interface AssignmentEditorProps {
  onClose: () => void;
  type?: 'word' | 'powerpoint';
}

const AssignmentEditor = ({ onClose, type = 'word' }: AssignmentEditorProps) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAppContext();
  
  // Initialize proctoring for this component too
  const { createWarning } = useProctoring('editor');
  
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      createWarning("Copy attempt detected in editor");
      toast({
        title: "Warning",
        description: "Copying content is not allowed during assignments",
        variant: "destructive"
      });
      return false;
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      createWarning("Paste attempt detected in editor");
      toast({
        title: "Warning",
        description: "Pasting content is not allowed during assignments",
        variant: "destructive"
      });
      return false;
    };
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [createWarning, toast]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulating save action
    setTimeout(() => {
      toast({
        title: "Content Saved",
        description: `Your ${type === 'word' ? 'document' : 'presentation'} has been saved`,
      });
      setIsSaving(false);
    }, 800);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {type === 'word' ? (
            <>
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Microsoft Word</span>
            </>
          ) : (
            <>
              <FileText className="h-5 w-5 text-orange-600" />
              <span>Microsoft PowerPoint</span>
            </>
          )}
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      
      <Card className="border border-gray-300">
        <CardContent className="p-0">
          <div className="border-b bg-gray-100 p-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                File
              </Button>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                View
              </Button>
              <Button variant="ghost" size="sm">
                Insert
              </Button>
              <Button variant="ghost" size="sm">
                Format
              </Button>
            </div>
          </div>
          
          <div className="p-4 min-h-[300px] bg-white">
            {type === 'word' ? (
              <textarea
                className="w-full h-[300px] p-2 border-none outline-none resize-none"
                placeholder="Start typing your document here..."
                value={content}
                onChange={handleContentChange}
              />
            ) : (
              <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-50 border border-dashed">
                <div className="text-center p-4 mb-4 bg-white border w-3/4">
                  <h3 className="font-bold mb-2">Slide 1: Title Slide</h3>
                  <textarea
                    className="w-full h-[100px] p-2 border outline-none resize-none"
                    placeholder="Click to add title..."
                    value={content}
                    onChange={handleContentChange}
                  />
                  <textarea
                    className="w-full h-[50px] p-2 border outline-none resize-none mt-2"
                    placeholder="Click to add subtitle..."
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Click to add notes
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-2">
        <div className="text-sm text-muted-foreground flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
          Copy and paste functionality is disabled during assignments
        </div>
        <Button onClick={onClose} variant="outline" size="sm">
          Close Editor
        </Button>
      </div>
    </div>
  );
};

export default AssignmentEditor;
