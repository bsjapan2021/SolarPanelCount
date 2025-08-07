import React from 'react';
import Image from 'next/image';

interface SatelliteImageViewerProps {
  imageUrl: string;
  showMarker?: boolean;
  markerPosition?: { x: number; y: number };
}

export const SatelliteImageViewer: React.FC<SatelliteImageViewerProps> = ({ 
  imageUrl, 
  showMarker = true, 
  markerPosition = { x: 50, y: 50 } 
}) => {
  return (
    <div className="relative mb-6">
      <Image
        src={imageUrl}
        alt="위성사진"
        width={640}
        height={400}
        className="w-full max-h-96 object-cover rounded-lg border-2 border-dashed border-gray-300"
        onError={(e) => {
          console.log('위성사진 로드 실패');
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* 주소 마커 표시 */}
      {showMarker && (
        <div 
          className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ 
            left: `${markerPosition.x}%`, 
            top: `${markerPosition.y}%` 
          }}
        >
          <div className="relative">
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
              선택된 주소
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
