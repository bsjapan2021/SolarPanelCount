import React from 'react';
import { Download, RotateCcw } from 'lucide-react';

interface StatisticsProps {
  roofArea: number;
  panelCount: number;
  totalCapacity: number;
  annualProduction: number;
  onGenerateLisp: () => void;
  onReset: () => void;
  canGenerate: boolean;
}

export const Statistics: React.FC<StatisticsProps> = ({
  roofArea,
  panelCount,
  totalCapacity,
  annualProduction,
  onGenerateLisp,
  onReset,
  canGenerate
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">시스템 통계</h3>
      
      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{roofArea.toFixed(1)}</div>
          <div className="text-xs text-gray-600">지붕 면적 (㎡)</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{panelCount}</div>
          <div className="text-xs text-gray-600">패널 수량</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{(totalCapacity / 1000).toFixed(1)}</div>
          <div className="text-xs text-gray-600">총 용량 (kW)</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{(annualProduction / 1000).toFixed(0)}</div>
          <div className="text-xs text-gray-600">연간 발전량 (MWh)</div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-2">
        <button
          onClick={onGenerateLisp}
          disabled={!canGenerate}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            canGenerate
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="w-4 h-4" />
          AutoCAD LISP 다운로드
        </button>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          다시 시작
        </button>
      </div>
    </div>
  );
};
