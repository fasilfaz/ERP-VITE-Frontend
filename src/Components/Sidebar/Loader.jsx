import React from 'react';

const FancyLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Outer spinning ring */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-t-yellow-400 border-r-red-500 border-b-pink-500 border-l-yellow-400 animate-spin"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 font-semibold animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default FancyLoader;