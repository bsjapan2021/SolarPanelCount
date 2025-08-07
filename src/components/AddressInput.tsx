import React, { useState } from 'react';
import { Satellite, Plus, Minus } from 'lucide-react';

interface AddressInputProps {
  value?: string;
  onAddressSelect: (address: string) => void;
  onSearch?: () => void;
  zoomLevel?: number;
  onZoomChange?: (level: number) => void;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value = '',
  onAddressSelect,
  onSearch,
  zoomLevel = 18,
  onZoomChange
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const koreanAddresses = [
    '서울특별시 강남구 테헤란로 152',
    '서울특별시 중구 세종대로 110',
    '서울특별시 종로구 청와대로 1',
    '서울시 성동구 왕십리로322',
    '부산광역시 해운대구 우동',
    '대구광역시 중구 동성로',
    '인천광역시 중구 공항로 272',
    '광주광역시 동구 금남로',
    '대전광역시 유성구 대학로',
    '울산광역시 남구 삼산로'
  ];

  const filteredAddresses = koreanAddresses.filter(addr => 
    addr.toLowerCase().includes(value.toLowerCase())
  );

  const handleInputChange = (inputValue: string) => {
    onAddressSelect(inputValue);
    setShowSuggestions(inputValue.length > 0);
  };

  const handleSuggestionClick = (address: string) => {
    onAddressSelect(address);
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };
  const handleZoomIn = () => {
    if (onZoomChange && zoomLevel < 21) {
      onZoomChange(zoomLevel + 1);
    }
  };

  const handleZoomOut = () => {
    if (onZoomChange && zoomLevel > 15) {
      onZoomChange(zoomLevel - 1);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* 주소 입력 */}
      <div className="relative">
        <input
          type="text"
          placeholder="예: 서울특별시 강남구 테헤란로 152 또는 임의의 주소"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(value.length > 0)}
          onBlur={handleInputBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
        
        {/* 자동완성 드롭다운 */}
        {showSuggestions && value && filteredAddresses.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredAddresses.slice(0, 5).map((addr, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-900"
                onClick={() => handleSuggestionClick(addr)}
              >
                {addr}
              </div>
            ))}
          </div>
        )}
        
        {/* 입력 도움말 */}
        <div className="mt-2 text-xs text-gray-500">
          💡 기존 목록에서 선택하거나 임의의 주소를 직접 입력하세요
        </div>
      </div>

      {/* 줌 레벨 컨트롤 */}
      {onZoomChange && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">위성사진 줌 레벨</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 15}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono bg-white px-3 py-1 rounded border min-w-[3rem] text-center">
              {zoomLevel}
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 21}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
              <button
          onClick={onSearch}
          disabled={!value}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Satellite size={16} />
          위성사진 로드
        </button>
    </div>
  );
};
