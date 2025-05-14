
// Utility functions for generating recommendations based on student performance

/**
 * Generate YouTube video recommendations based on student performance
 * @param studentPerformance Performance data with topic scores
 * @returns Array of YouTube video recommendations
 */
export const generateYouTubeRecommendations = (studentPerformance: any) => {
  const weakTopics = Object.entries(studentPerformance.topics)
    .filter(([_, data]: [string, any]) => data.correct / data.total < 0.6)
    .map(([topic]) => topic);
  
  // Simulated YouTube video recommendations
  const recommendations = weakTopics.map(topic => ({
    id: `vid-${Math.random().toString(36).substring(2, 10)}`,
    title: `Understanding ${topic} - Complete Tutorial`,
    channelName: `EduTech Academy`,
    thumbnailUrl: `https://picsum.photos/seed/${topic}/320/180`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+tutorial`,
    topic: topic,
    duration: '12:34',
    views: '256K'
  }));
  
  return recommendations;
};
