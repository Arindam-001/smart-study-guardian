
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileEdit, FilePenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface AssignmentEditorProps {
  onClose: () => void;
}

const AssignmentEditor: React.FC<AssignmentEditorProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('word');
  const [wordContent, setWordContent] = useState('');
  const [pptContent, setPptContent] = useState('');
  const { toast } = useToast();
  
  // Prevent copy/paste operations
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({
        title: "Action Restricted",
        description: "Copy and paste functions are disabled in this editor",
        variant: "destructive"
      });
      return false;
    };
    
    // Add event listeners
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    
    // Clean up
    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
    };
  }, []);

  // Handle MS Word text formatting
  const handleWordFormatting = (format: string) => {
    const textarea = document.getElementById('word-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = wordContent.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = end;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = start + formattedText.length;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPos = start + formattedText.length;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        newCursorPos = start + formattedText.length;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        newCursorPos = start + formattedText.length;
        break;
      case 'bullet':
        formattedText = `• ${selectedText}`;
        newCursorPos = start + formattedText.length;
        break;
    }
    
    const newContent = wordContent.substring(0, start) + formattedText + wordContent.substring(end);
    setWordContent(newContent);
    
    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  // Handle PowerPoint slide operations
  const handlePptOperation = (operation: string) => {
    switch(operation) {
      case 'new-slide':
        setPptContent(prev => `${prev}\n\n--- New Slide ---\n`);
        break;
      case 'add-title':
        setPptContent(prev => `${prev}\n[Title]: Your Slide Title\n`);
        break;
      case 'add-bullet':
        setPptContent(prev => `${prev}\n• Bullet point\n`);
        break;
      case 'add-image':
        setPptContent(prev => `${prev}\n[Image Placeholder]\n`);
        break;
    }
  };

  const handleSave = () => {
    toast({
      title: "Content Saved",
      description: "Your document has been saved to your assignment"
    });
    onClose();
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          {activeTab === 'word' ? (
            <>
              <FileEdit className="mr-2 h-5 w-5" />
              Document Editor
            </>
          ) : (
            <>
              <FilePenLine className="mr-2 h-5 w-5" />
              Presentation Editor
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="word">MS Word</TabsTrigger>
            <TabsTrigger value="ppt">MS PowerPoint</TabsTrigger>
          </TabsList>
          
          {/* MS Word Editor */}
          <TabsContent value="word" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWordFormatting('bold')}
                className="font-bold"
              >
                B
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWordFormatting('italic')}
                className="italic"
              >
                I
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWordFormatting('underline')}
                className="underline"
              >
                U
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWordFormatting('heading')}
              >
                Heading
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWordFormatting('bullet')}
              >
                • Bullet
              </Button>
            </div>
            
            <div className="border rounded-md p-4 bg-white">
              <textarea
                id="word-editor"
                value={wordContent}
                onChange={(e) => setWordContent(e.target.value)}
                className="w-full h-[400px] outline-none resize-none"
                placeholder="Start typing your document here... (Copy and paste are disabled)"
                spellCheck="true"
              />
            </div>
          </TabsContent>
          
          {/* MS PowerPoint Editor */}
          <TabsContent value="ppt" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePptOperation('new-slide')}
              >
                New Slide
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePptOperation('add-title')}
              >
                Add Title
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePptOperation('add-bullet')}
              >
                Add Bullet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePptOperation('add-image')}
              >
                Add Image
              </Button>
            </div>
            
            <div className="border rounded-md bg-white">
              <AspectRatio ratio={16/9} className="bg-slate-100 border-b">
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  Slide Preview (Simplified)
                </div>
              </AspectRatio>
              <textarea
                value={pptContent}
                onChange={(e) => setPptContent(e.target.value)}
                className="w-full h-[300px] p-4 outline-none resize-none"
                placeholder="Design your presentation here... (Copy and paste are disabled)"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentEditor;
