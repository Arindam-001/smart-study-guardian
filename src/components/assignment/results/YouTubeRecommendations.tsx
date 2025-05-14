
import React from 'react';

interface YouTubeRecommendationsProps {
  recommendations: {
    id: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
    url: string;
    topic: string;
    duration: string;
    views: string;
  }[];
}

const YouTubeRecommendations = ({ recommendations }: YouTubeRecommendationsProps) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No video recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map(video => (
        <div key={video.id} className="border rounded-md overflow-hidden">
          <div className="relative aspect-video bg-gray-100">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black text-white px-1 text-xs rounded">
              {video.duration}
            </div>
          </div>
          <div className="p-3">
            <h4 className="font-medium line-clamp-2">{video.title}</h4>
            <div className="text-sm text-muted-foreground flex justify-between mt-1">
              <span>{video.channelName}</span>
              <span>{video.views} views</span>
            </div>
            <div className="mt-2">
              <a 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-edu-primary text-sm hover:underline"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YouTubeRecommendations;
