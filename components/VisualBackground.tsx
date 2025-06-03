
import React from 'react';

interface VisualBackgroundProps {
  keyword: string;
}

export const VisualBackground: React.FC<VisualBackgroundProps> = ({ keyword }) => {
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(keyword)}/1920/1080`;

  return (
    <div 
      className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out z-0"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div> {/* Dark overlay for text readability */}
    </div>
  );
};
