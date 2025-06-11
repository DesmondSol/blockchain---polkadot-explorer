
import React from 'react';

interface VisualBackgroundProps {
  keyword: string;
}

export const VisualBackground: React.FC<VisualBackgroundProps> = ({ keyword }) => {
  // Using Unsplash to get more theme-relevant images.
  // Fetches a random 1920x1080 image related to the keyword.
  const encodedKeyword = encodeURIComponent(keyword);
  const imageUrl = `https://img.decrypt.co/insecure/rs:fit:1920:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/05/polkadot-coins-gID_7.jpg@webp`;

  return (
    <div 
      className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out z-0"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 w-full h-full bg-black opacity-60"></div> {/* Dark overlay for text readability, increased opacity slightly */}
    </div>
  );
};
