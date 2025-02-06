import React from 'react';

const FancyLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="relative w-24 h-24">
        {/* Outer rotating squares */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
              style={{
                transform: `rotate(${i * 90}deg) translate(32px) rotate(${i * 45}deg)`
              }}
            />
          ))}
        </div>

        {/* Middle rotating triangles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0 h-0 border-8"
              style={{
                transform: `rotate(${i * 120}deg) translate(24px)`,
                borderTopColor: i === 0 ? '#FBBF24' : i === 1 ? '#EF4444' : '#EC4899',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}
            />
          ))}
        </div>

        {/* Inner rotating diamond */}
        <div className="absolute top-8 left-8 w-8 h-8 animate-spin" style={{ animationDuration: '1.5s' }}>
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse"
            style={{ transform: 'rotate(45deg)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default FancyLoader;