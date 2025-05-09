
import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ProctoringMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  movementCount: number;
  hasWarning: boolean;
}

const ProctoringMonitor = ({ 
  videoRef,
  movementCount,
  hasWarning 
}: ProctoringMonitorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="text-edu-primary" size={20} />
          Proctoring Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-md"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
            LIVE
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Movement level:</span>
            <span className={movementCount > 30 ? "text-edu-danger" : "text-edu-success"}>
              {movementCount > 30 ? "High" : "Normal"} ({movementCount})
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tab switching:</span>
            <span className="text-edu-success">None</span>
          </div>
        </div>

        {hasWarning && (
          <Alert variant="destructive" className="mt-4 animate-pulse-warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Suspicious activity detected. This has been reported to your instructor.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProctoringMonitor;
