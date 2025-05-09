
import React from 'react';
import { Camera, AlertTriangle, Eye, MonitorOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ProctoringMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  movementCount: number;
  hasWarning: boolean;
  deviceDetected?: boolean;
  tabSwitchCount?: number;
}

const ProctoringMonitor = ({ 
  videoRef,
  movementCount,
  hasWarning,
  deviceDetected = false,
  tabSwitchCount = 0
}: ProctoringMonitorProps) => {
  // Determine movement level
  const movementLevel = movementCount > 30 ? "High" : 
                       movementCount > 15 ? "Medium" : "Normal";
  
  // Determine movement color
  const movementColor = movementCount > 30 ? "text-edu-danger" : 
                       movementCount > 15 ? "text-yellow-500" : "text-edu-success";

  return (
    <Card className={hasWarning ? "border-red-500" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Camera className="text-edu-primary" size={20} />
          Proctoring Monitor
          {hasWarning && (
            <AlertTriangle className="text-red-500 ml-auto animate-pulse" size={20} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-auto rounded-md ${hasWarning ? "border-2 border-red-500" : ""}`}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
            LIVE
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Movement level:</span>
              <span className={movementColor}>
                {movementLevel} ({movementCount})
              </span>
            </div>
            <Progress value={(movementCount / 50) * 100} className="h-1" />
          </div>
          
          <div className="flex justify-between">
            <span>Tab switching:</span>
            <span className={tabSwitchCount > 0 ? "text-edu-danger" : "text-edu-success"}>
              {tabSwitchCount > 0 ? `${tabSwitchCount} violations` : "None"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Device detection:</span>
            <span className={deviceDetected ? "text-edu-danger" : "text-edu-success"}>
              {deviceDetected ? (
                <span className="flex items-center"><Eye size={14} className="mr-1" />Detected</span>
              ) : (
                <span className="flex items-center"><MonitorOff size={14} className="mr-1" />None</span>
              )}
            </span>
          </div>
        </div>

        {hasWarning && (
          <Alert variant="destructive" className="mt-4 animate-pulse">
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
