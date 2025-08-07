import React from 'react';

interface PanelSettingsProps {
  panelWidth: number;
  panelHeight: number;
  panelSpacing: number;
  borderMargin: number;
  panelCapacity: number;
  onPanelWidthChange: (value: number) => void;
  onPanelHeightChange: (value: number) => void;
  onPanelSpacingChange: (value: number) => void;
  onBorderMarginChange: (value: number) => void;
  onPanelCapacityChange: (value: number) => void;
  disabled: boolean;
}

export const PanelSettings: React.FC<PanelSettingsProps> = ({
  panelWidth,
  panelHeight,
  panelSpacing,
  borderMargin,
  panelCapacity,
  onPanelWidthChange,
  onPanelHeightChange,
  onPanelSpacingChange,
  onBorderMarginChange,
  onPanelCapacityChange,
  disabled
}) => {
  return (
    <div className="space-y-4">
      {/* 패널 폭 */}
      <div>
        <label 
          htmlFor="panelWidth" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          패널 폭 (m)
        </label>
        <input
          type="number"
          id="panelWidth"
          value={panelWidth}
          onChange={(e) => onPanelWidthChange(parseFloat(e.target.value) || 0)}
          min="1"
          max="3"
          step="0.1"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
        />
      </div>

      {/* 패널 높이 */}
      <div>
        <label 
          htmlFor="panelHeight" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          패널 높이 (m)
        </label>
        <input
          type="number"
          id="panelHeight"
          value={panelHeight}
          onChange={(e) => onPanelHeightChange(parseFloat(e.target.value) || 0)}
          min="0.5"
          max="2"
          step="0.1"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
        />
      </div>

      {/* 패널 간격 */}
      <div>
        <label 
          htmlFor="panelSpacing" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          패널 간격 (m)
        </label>
        <input
          type="number"
          id="panelSpacing"
          value={panelSpacing}
          onChange={(e) => onPanelSpacingChange(parseFloat(e.target.value) || 0)}
          min="0.05"
          max="0.5"
          step="0.05"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
        />
      </div>

      {/* 경계 여백 */}
      <div>
        <label 
          htmlFor="borderMargin" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          경계 여백 (m)
        </label>
        <input
          type="number"
          id="borderMargin"
          value={borderMargin}
          onChange={(e) => onBorderMarginChange(parseFloat(e.target.value) || 0)}
          min="0.1"
          max="1"
          step="0.1"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
        />
      </div>

      {/* 패널 용량 */}
      <div>
        <label 
          htmlFor="panelCapacity" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          패널 용량 (W)
        </label>
        <input
          type="number"
          id="panelCapacity"
          value={panelCapacity}
          onChange={(e) => onPanelCapacityChange(parseInt(e.target.value) || 0)}
          min="200"
          max="600"
          step="50"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
        />
      </div>
    </div>
  );
};
