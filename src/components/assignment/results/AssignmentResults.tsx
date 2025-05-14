
import React from 'react';
import { Assignment } from '@/lib/interfaces/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Youtube } from 'lucide-react';
import StudentPerformanceCard from '@/components/student/StudentPerformanceCard';
import RecommendationsCard from '@/components/student/RecommendationsCard';
import YouTubeRecommendations from './YouTubeRecommendations';

interface AssignmentResultsProps {
  assignment: Assignment;
  performance: any;
  youtubeRecommendations: any[];
  onComplete: () => void;
}

const AssignmentResults = ({ 
  assignment, 
  performance, 
  youtubeRecommendations, 
  onComplete 
}: AssignmentResultsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-edu-primary text-xl">
            Assignment Results: {assignment.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StudentPerformanceCard performance={performance} />
          
          <div className="my-6">
            <Tabs defaultValue="recommendations">
              <TabsList>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>Learning Resources</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  <span>Recommended Videos</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations" className="mt-4">
                <h3 className="text-lg font-medium mb-4">Personalized Recommendations</h3>
                <RecommendationsCard resources={performance.recommendedResources} />
              </TabsContent>
              
              <TabsContent value="videos" className="mt-4">
                <h3 className="text-lg font-medium mb-4">Recommended YouTube Videos</h3>
                <YouTubeRecommendations recommendations={youtubeRecommendations} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center">
            <Button onClick={onComplete} className="px-8">
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentResults;
