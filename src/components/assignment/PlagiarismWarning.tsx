
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlagiarismDetail } from '@/lib/interfaces/assignment';
import { AlertTriangle } from 'lucide-react';

interface PlagiarismWarningProps {
  plagiarismScore: number;
  plagiarismDetails?: PlagiarismDetail[];
}

const PlagiarismWarning: React.FC<PlagiarismWarningProps> = ({ 
  plagiarismScore, 
  plagiarismDetails = [] 
}) => {
  if (!plagiarismScore || plagiarismScore < 20) {
    return (
      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-green-700 text-sm flex items-center gap-2">
            No Plagiarism Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Similarity Score:</span>
            <Progress value={plagiarismScore} className="h-2" />
            <span className="text-xs font-medium">{plagiarismScore}%</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getColorByScore = (score: number) => {
    if (score < 40) return { bg: 'bg-yellow-50', text: 'text-yellow-700', progress: 'bg-yellow-500' };
    if (score < 70) return { bg: 'bg-orange-50', text: 'text-orange-700', progress: 'bg-orange-500' };
    return { bg: 'bg-red-50', text: 'text-red-700', progress: 'bg-red-500' };
  };
  
  const colors = getColorByScore(plagiarismScore);
  
  return (
    <Card className={colors.bg}>
      <CardHeader className="pb-2">
        <CardTitle className={`${colors.text} text-sm flex items-center gap-2`}>
          <AlertTriangle className="h-4 w-4" />
          {plagiarismScore >= 70 ? 'High' : plagiarismScore >= 40 ? 'Moderate' : 'Low'} Plagiarism Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Similarity Score:</span>
          <Progress value={plagiarismScore} className={`h-2 [&>div]:${colors.progress}`} />
          <span className="text-xs font-medium">{plagiarismScore}%</span>
        </div>
        
        {plagiarismDetails.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Matched content from:</h4>
            <div className="text-xs space-y-2">
              {plagiarismDetails.map((detail, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-2">
                  <div className="font-medium">{detail.noteName} ({detail.similarity}% match)</div>
                  {detail.matchedText && (
                    <div className="text-muted-foreground mt-1">
                      Matched: "{detail.matchedText}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlagiarismWarning;
