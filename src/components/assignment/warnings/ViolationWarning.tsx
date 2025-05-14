
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ViolationWarningProps {
  count: number;
}

const ViolationWarning = ({ count }: ViolationWarningProps) => {
  if (count === 0) return null;
  
  return (
    <Card className="mt-4 border-red-200">
      <CardContent className="pt-4">
        <div className="flex items-center text-red-600 mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Warning</h3>
        </div>
        <p className="text-sm">
          You have switched tabs {count} {count === 1 ? 'time' : 'times'}. 
          Your assignment will be automatically submitted after 3 violations.
        </p>
      </CardContent>
    </Card>
  );
};

export default ViolationWarning;
