
import { useState } from 'react';
import { generateYouTubeRecommendations } from '../utils/recommendationUtils';
import { useToast } from '@/components/ui/use-toast';

export const usePerformanceTracking = () => {
  const [performance, setPerformance] = useState<any>(null);
  const [youtubeRecommendations, setYoutubeRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const processPerformanceResults = (results: any) => {
    setPerformance(results);
    
    // Generate YouTube recommendations based on performance
    const recommendations = generateYouTubeRecommendations(results);
    setYoutubeRecommendations(recommendations);
    
    return { results, recommendations };
  };

  return {
    performance,
    youtubeRecommendations,
    processPerformanceResults,
    toast
  };
};
