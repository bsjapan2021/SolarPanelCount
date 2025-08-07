import React from 'react';
import Image from 'next/image';

interface SatelliteImageViewerProps {
  imageUrl: string;
}

export const SatelliteImageViewer: React.FC<SatelliteImageViewerProps> = ({ imageUrl }) => {
  return (
    <div className="mb-6">
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
    </div>
  );
};
