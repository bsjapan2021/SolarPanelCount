import React, { useRef, useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface RoofCanvasProps {
  onRoofClick: (point: Point) => void;
  roofPoints: Point[];
  isComplete: boolean;
  width?: number;
  height?: number;
}

const RoofCanvas: React.FC<RoofCanvasProps> = ({ 
  onRoofClick, 
  roofPoints, 
  isComplete, 
  width = 600, 
  height = 400 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [showMouseCoords, setShowMouseCoords] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 캔버스 크기 설정
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 배경 그리기
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 그리드 그리기
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // 세로선
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // 가로선
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 지붕 점들이 없으면 여기서 종료
    if (roofPoints.length === 0) {
      return;
    }

    // 점들 그리기
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;

    roofPoints.forEach((point: Point, index: number) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // 점 번호 표시
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), point.x, point.y + 4);
      ctx.fillStyle = '#3b82f6';
    });

    // 선 그리기
    if (roofPoints.length > 1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      ctx.moveTo(roofPoints[0].x, roofPoints[0].y);
      
      for (let i = 1; i < roofPoints.length; i++) {
        ctx.lineTo(roofPoints[i].x, roofPoints[i].y);
      }
      
      // 지붕이 완성되었으면 마지막 점과 첫 점을 연결
      if (isComplete && roofPoints.length >= 3) {
        ctx.lineTo(roofPoints[0].x, roofPoints[0].y);
      }
      
      ctx.stroke();
    }

    // 마우스 위치에서 첫 번째 점까지의 미리보기 선 그리기
    if (roofPoints.length > 0 && !isComplete && showMouseCoords) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(roofPoints[roofPoints.length - 1].x, roofPoints[roofPoints.length - 1].y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [roofPoints, width, height, mousePos, showMouseCoords, isComplete]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isComplete) return; // 지붕이 완성되었으면 더 이상 점 추가 불가

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // 첫 번째 점 근처 클릭 확인 (지붕 완성)
    if (roofPoints.length >= 3) {
      const firstPoint = roofPoints[0];
      const distance = Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2));
      
      if (distance <= 20) {
        // 지붕 완성 신호를 부모에게 전달 (특별한 완성 포인트)
        onRoofClick({ x: -1, y: -1 }); // 완성 신호로 특별한 좌표 사용
        return;
      }
    }

    // 새 점 추가
    onRoofClick({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    setMousePos({ x, y });
  };

  return (
    <div className="mb-6">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowMouseCoords(true)}
        onMouseLeave={() => setShowMouseCoords(false)}
        className="w-full border-2 border-blue-400 rounded-lg cursor-crosshair bg-gray-50 hover:border-blue-600 hover:shadow-lg transition-all"
        style={{ maxHeight: '400px' }}
      />
      
      {/* 마우스 좌표 표시 */}
      {showMouseCoords && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-center text-sm text-gray-600">
          마우스 위치: X: {mousePos.x}, Y: {mousePos.y}
          {roofPoints.length >= 3 && !isComplete && (
            <span className="ml-4 text-blue-600">
              첫 번째 점을 클릭하여 지붕 완성
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RoofCanvas;
