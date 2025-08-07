'use client';

import React, { useState } from 'react';
import { MapPin, Satellite, Circle } from 'lucide-react';
import { ProgressSteps } from './ProgressSteps';
import { AddressInput } from './AddressInput';
import { PanelSettings } from './PanelSettings';
import { SatelliteImageViewer } from './SatelliteImageViewer';
import { RoofCanvas } from './RoofCanvas';
import { Statistics } from './Statistics';
import { InstructionText } from './InstructionText';

interface Point {
  x: number;
  y: number;
}

interface PanelConfig {
  width: number;
  height: number;
  edgeMargin: number;
  spacing: number;
}

interface Stats {
  totalPanels: number;
  totalPowerKW: number;
  roofAreaM2: number;
  efficiency: number;
}

export const SolarPanelSystem: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [address, setAddress] = useState('서울시 강남구');
  const [roofPoints, setRoofPoints] = useState<Point[]>([]);
  const [isRoofComplete, setIsRoofComplete] = useState(false);
  const [panelConfig, setPanelConfig] = useState<PanelConfig>({
    width: 2000,
    height: 1000,
    edgeMargin: 500,
    spacing: 200
  });
  const [stats, setStats] = useState<Stats>({
    totalPanels: 0,
    totalPowerKW: 0,
    roofAreaM2: 0,
    efficiency: 0
  });
  const [instructionText, setInstructionText] = useState(
    '📌 <strong>사용 방법:</strong><br/>1. 위 주소 입력란에 주소를 입력하세요<br/>2. "🛰️ 위성사진 가져오기" 버튼을 클릭하세요<br/>3. 위성사진이 로드되면 지붕 모서리를 <strong>클릭</strong>하여 윤곽을 그리세요<br/>4. 첫 번째 점 근처를 클릭하면 윤곽이 완성됩니다<br/>5. 패널 설정 후 CAD 도면을 생성하세요<br/><br/><strong>💡 특징:</strong> Google Maps API를 사용한 정확한 위성사진'
  );

  const API_KEY = ''; // Google Maps API 사용 안함

  // 한국 주소 데이터베이스 (간소화 버전)
  const koreanAddressDatabase = {
    '서울시 강남구': { lat: 37.5173, lng: 127.0473, formatted_address: '서울특별시 강남구' },
    '서울시 종로구': { lat: 37.5735, lng: 126.9788, formatted_address: '서울특별시 종로구' },
    '서울시 중구': { lat: 37.5641, lng: 126.9979, formatted_address: '서울특별시 중구' },
    '서울시 용산구': { lat: 37.5311, lng: 126.9810, formatted_address: '서울특별시 용산구' },
    '서울시 성동구': { lat: 37.5506, lng: 127.0408, formatted_address: '서울특별시 성동구' },
    '서울시 광진구': { lat: 37.5481, lng: 127.0857, formatted_address: '서울특별시 광진구' },
    '서울시 동대문구': { lat: 37.5838, lng: 127.0507, formatted_address: '서울특별시 동대문구' },
    '서울시 중랑구': { lat: 37.5951, lng: 127.0928, formatted_address: '서울특별시 중랑구' },
    '서울시 성북구': { lat: 37.6023, lng: 127.0167, formatted_address: '서울특별시 성북구' },
    '서울시 강북구': { lat: 37.6469, lng: 127.0147, formatted_address: '서울특별시 강북구' },
    '서울시 도봉구': { lat: 37.6688, lng: 127.0471, formatted_address: '서울특별시 도봉구' },
    '서울시 노원구': { lat: 37.6542, lng: 127.0568, formatted_address: '서울특별시 노원구' },
    '서울시 은평구': { lat: 37.6176, lng: 126.9227, formatted_address: '서울특별시 은평구' },
    '서울시 서대문구': { lat: 37.5791, lng: 126.9368, formatted_address: '서울특별시 서대문구' },
    '서울시 마포구': { lat: 37.5663, lng: 126.9019, formatted_address: '서울특별시 마포구' },
    '서울시 양천구': { lat: 37.5270, lng: 126.8561, formatted_address: '서울특별시 양천구' },
    '서울시 강서구': { lat: 37.5657, lng: 126.8226, formatted_address: '서울특별시 강서구' },
    '서울시 구로구': { lat: 37.4954, lng: 126.8581, formatted_address: '서울특별시 구로구' },
    '서울시 금천구': { lat: 37.4606, lng: 126.9006, formatted_address: '서울특별시 금천구' },
    '서울시 영등포구': { lat: 37.5264, lng: 126.8962, formatted_address: '서울특별시 영등포구' },
    '서울시 동작구': { lat: 37.4971, lng: 126.9395, formatted_address: '서울특별시 동작구' },
    '서울시 관악구': { lat: 37.4653, lng: 126.9447, formatted_address: '서울특별시 관악구' },
    '서울시 서초구': { lat: 37.4734, lng: 127.0164, formatted_address: '서울특별시 서초구' },
    '서울시 강동구': { lat: 37.5502, lng: 127.1469, formatted_address: '서울특별시 강동구' },
    '서울시 송파구': { lat: 37.5048, lng: 127.1145, formatted_address: '서울특별시 송파구' },
    '부산시 해운대구': { lat: 35.1631, lng: 129.1639, formatted_address: '부산광역시 해운대구' },
    '부산시 중구': { lat: 35.1037, lng: 129.0317, formatted_address: '부산광역시 중구' },
    '대구시 중구': { lat: 35.8714, lng: 128.5911, formatted_address: '대구광역시 중구' },
    '인천시 연수구': { lat: 37.4138, lng: 126.6378, formatted_address: '인천광역시 연수구' },
    '광주시 서구': { lat: 35.1520, lng: 126.8895, formatted_address: '광주광역시 서구' },
    '대전시 유성구': { lat: 36.3504, lng: 127.3845, formatted_address: '대전광역시 유성구' },
    '울산시 남구': { lat: 35.5384, lng: 129.3114, formatted_address: '울산광역시 남구' },
    '세종시': { lat: 36.4800, lng: 127.2890, formatted_address: '세종특별자치시' },
    '경기도 수원시': { lat: 37.2636, lng: 127.0286, formatted_address: '경기도 수원시' },
    '경기도 성남시': { lat: 37.4201, lng: 127.1262, formatted_address: '경기도 성남시' },
        '경기도 고양시': { lat: 37.6584, lng: 126.8320, formatted_address: '경기도 고양시' }
  };

  // 좌표로 직접 진행하는 함수
  const loadByCoordinatesDirectly = (lat: number, lng: number) => {
    console.log(`좌표로 직접 진행: ${lat}, ${lng}`);
    
    setProgress(50);
    setCurrentStep(2);
    
    setInstructionText(`✅ 좌표 기반 작업 모드로 전환되었습니다.<br/>📍 위치: ${lat.toFixed(6)}, ${lng.toFixed(6)}<br/>🎯 캔버스에서 지붕 모서리를 <strong>클릭</strong>하여 윤곽을 그려주세요.<br/>💡 팁: 대략적인 지붕 크기로 윤곽을 그리시면 됩니다.<br/><br/><div style="background: #e8f4f8; padding: 10px; border-radius: 5px;"><strong>참고:</strong> API 없이도 지붕 윤곽을 그리고 패널 배치 계산이 가능합니다.</div>`);
    
    console.log('좌표 기반 작업 모드 활성화');
  };
  };

  const loadSatelliteImage = async () => {
    if (!address) {
      alert('주소를 입력해주세요.');
      return;
    }

    try {
      setProgress(25);
      setCurrentStep(2);
      setInstructionText('🔍 주소를 검색하고 있습니다...');

      // 한국 주소 데이터베이스에서 검색
      const location = findKoreanAddress(address);
      
      if (location) {
        console.log('한국 주소 데이터베이스에서 발견된 위치:', location);
        setInstructionText(`✅ 주소 발견: ${location.formatted_address}<br/>좌표: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}<br/>� 좌표 기반 캔버스를 설정하고 있습니다...`);
        
        // Google Maps API 없이 바로 좌표 기반 캔버스 사용
        loadByCoordinatesDirectly(location.lat, location.lng);
        return;
      }

      // 주소를 찾을 수 없는 경우
      const suggestions = Object.keys(koreanAddressDatabase).slice(0, 5).join('<br/>• ');
      setInstructionText(`❌ 주소를 찾을 수 없습니다.<br/><br/><strong>다음과 같이 시도해보세요:</strong><br/>1. 더 간단하게: "서울시 강남구" (도로명/건물명 제외)<br/>2. 정확한 구 이름: "서울시 종로구"<br/>3. 아래 지원 지역 중 선택:<br/><br/><strong>🏢 지원 지역 예시:</strong><br/>• ${suggestions}<br/><br/><div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-top: 10px;"><strong>💡 팁:</strong> 정확한 주소가 없어도 근처 구 이름만으로도 검색 가능합니다!</div>`);
      setProgress(0);
      setCurrentStep(1);

    } catch (error) {
      console.error('위성사진 로드 오류:', error);
      setInstructionText(`❌ 오류가 발생했습니다: ${error}<br/><br/><strong>해결 방법:</strong><br/>1. 다른 주소로 시도해보세요<br/>2. 좌표 직접 입력하기`);
    }
  };

  const findKoreanAddress = (searchAddress: string) => {
    console.log('검색 주소:', searchAddress);
    
    // 검색 주소를 정규화 (공백 제거, 소문자 변환)
    const normalizedSearch = searchAddress.replace(/\s+/g, '').toLowerCase()
      .replace(/특별시|광역시|자치시/g, '시')
      .replace(/특별자치도|자치도/g, '도');
    
    console.log('정규화된 검색 주소:', normalizedSearch);
    
    // 데이터베이스에서 검색
    for (const [key, value] of Object.entries(koreanAddressDatabase)) {
      const normalizedKey = key.replace(/\s+/g, '').toLowerCase();
      
      console.log('비교 중:', normalizedKey, 'vs', normalizedSearch);
      
      // 1. 정확한 매치 (구까지)
      if (normalizedSearch.includes(normalizedKey)) {
        console.log('정확한 매치 발견:', key);
        return value;
      }
      
      // 2. 부분 매치 (시/구 단위)
      const searchParts = normalizedSearch.split(/시|구|동|로|길/).filter(part => part.length > 0);
      const keyParts = normalizedKey.split(/시|구|동/).filter(part => part.length > 0);
      
      let matchCount = 0;
      for (const searchPart of searchParts) {
        for (const keyPart of keyParts) {
          if (searchPart.includes(keyPart) || keyPart.includes(searchPart)) {
            matchCount++;
            break;
          }
        }
      }
      
      // 2개 이상의 부분이 매치되면 선택
      if (matchCount >= 2) {
        console.log('부분 매치 발견:', key, '매치 수:', matchCount);
        return value;
      }
    }
    
    console.log('주소를 찾을 수 없음');
    return null;
  };

  const calculatePanelLayout = () => {
    if (roofPoints.length < 3) {
      alert('먼저 지붕 윤곽을 그려주세요 (최소 3개 점 필요).');
      return;
    }

    setProgress(75);
    setCurrentStep(3);

    // 간단한 직사각형 배치 계산 (데모용)
    const roofWidth = 15000; // 15m
    const roofHeight = 10000; // 10m
    
    const panelsPerRow = Math.floor((roofWidth - 2 * panelConfig.edgeMargin) / (panelConfig.width + panelConfig.spacing));
    const panelsPerCol = Math.floor((roofHeight - 2 * panelConfig.edgeMargin) / (panelConfig.height + panelConfig.spacing));
    
    const totalPanels = panelsPerRow * panelsPerCol;
    const totalPowerKW = totalPanels * 0.4; // 400W per panel
    const roofAreaM2 = (roofWidth * roofHeight) / 1000000;
    const panelAreaM2 = (totalPanels * panelConfig.width * panelConfig.height) / 1000000;
    const efficiency = (panelAreaM2 / roofAreaM2) * 100;

    setStats({
      totalPanels,
      totalPowerKW: Math.round(totalPowerKW * 10) / 10,
      roofAreaM2: Math.round(roofAreaM2 * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10
    });

    setInstructionText('✅ 패널 배치가 완료되었습니다. CAD 도면을 생성하세요.');
  };

  const generateCADFile = () => {
    setProgress(100);
    setCurrentStep(4);

    // LISP 코드 생성
    const lispCode = generateLispCode();
    
    // 파일 다운로드
    downloadFile('solar_panel_layout.lsp', lispCode);
    
    setInstructionText('✅ CAD 도면 파일이 생성되었습니다!');
  };

  const generateLispCode = (): string => {
    let lispCode = `;; 자동 생성된 태양광 패널 배치 도면\n`;
    lispCode += `;; 생성 시간: ${new Date().toLocaleString()}\n\n`;
    lispCode += `(defun C:SOLAR_AUTO ()\n`;
    lispCode += `  (setvar "CMDECHO" 0)\n`;
    lispCode += `  (command "_LAYER" "_NEW" "SOLAR_PANEL" "")\n`;
    lispCode += `  (command "_LAYER" "_COLOR" "4" "SOLAR_PANEL" "")\n\n`;

    // 간단한 패널 배치 생성
    const panelsPerRow = Math.floor((15000 - 2 * panelConfig.edgeMargin) / (panelConfig.width + panelConfig.spacing));
    const panelsPerCol = Math.floor((10000 - 2 * panelConfig.edgeMargin) / (panelConfig.height + panelConfig.spacing));

    let panelIndex = 1;
    for (let row = 0; row < panelsPerCol; row++) {
      for (let col = 0; col < panelsPerRow; col++) {
        const x = panelConfig.edgeMargin + col * (panelConfig.width + panelConfig.spacing);
        const y = panelConfig.edgeMargin + row * (panelConfig.height + panelConfig.spacing);

        lispCode += `  ;; 패널 ${panelIndex}\n`;
        lispCode += `  (entmake (list\n`;
        lispCode += `    (cons 0 "LWPOLYLINE")\n`;
        lispCode += `    (cons 8 "SOLAR_PANEL")\n`;
        lispCode += `    (cons 62 4)\n`;
        lispCode += `    (cons 90 4)\n`;
        lispCode += `    (cons 70 1)\n`;
        lispCode += `    (cons 10 (list ${x} ${y}))\n`;
        lispCode += `    (cons 10 (list ${x + panelConfig.width} ${y}))\n`;
        lispCode += `    (cons 10 (list ${x + panelConfig.width} ${y + panelConfig.height}))\n`;
        lispCode += `    (cons 10 (list ${x} ${y + panelConfig.height}))\n`;
        lispCode += `  ))\n\n`;
        
        panelIndex++;
      }
    }

    lispCode += `  (setvar "CMDECHO" 1)\n`;
    lispCode += `  (princ "\\n태양광 패널 ${stats.totalPanels}개 배치 완료!")\n`;
    lispCode += `  (princ)\n`;
    lispCode += `)\n`;

    return lispCode;
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRoofPointAdd = (point: Point) => {
    setRoofPoints(prev => [...prev, point]);
  };

  const handleRoofComplete = (points: Point[]) => {
    setRoofPoints(points);
    setIsRoofComplete(true);
  };

  return (
    <div className="p-8">
      {/* Progress Steps */}
      <ProgressSteps currentStep={currentStep} />
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Input Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <MapPin className="text-blue-600" />
            설정 입력
          </h2>

          <AddressInput
            address={address}
            onAddressChange={setAddress}
            onLoadSatellite={loadSatelliteImage}
          />

          <PanelSettings
            config={panelConfig}
            onConfigChange={setPanelConfig}
            onCalculateLayout={calculatePanelLayout}
            onGenerateCAD={generateCADFile}
            canCalculate={isRoofComplete}
            canGenerateCAD={stats.totalPanels > 0}
          />
        </div>

        {/* Right Panel - Result Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Satellite className="text-blue-600" />
            결과 화면
          </h2>

          {satelliteImageUrl ? (
            <SatelliteImageViewer imageUrl={satelliteImageUrl} />
          ) : (
            <RoofCanvas
              points={roofPoints}
              onPointAdd={handleRoofPointAdd}
              onRoofComplete={handleRoofComplete}
              width={640}
              height={400}
            />
          )}

          {/* Roof Drawing Status */}
          {roofPoints.length > 0 && !isRoofComplete && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Circle className="w-4 h-4" />
                <span className="font-semibold">{roofPoints.length}개 점 선택됨</span>
                {roofPoints.length >= 3 ? (
                  <span className="text-red-600">| 첫 번째 점 근처를 클릭하여 완성하세요!</span>
                ) : (
                  <span className="text-gray-600">| 지붕 모서리를 계속 클릭하세요 (최소 3개 점 필요)</span>
                )}
              </div>
            </div>
          )}

          {isRoofComplete && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-green-800 font-semibold">
                ✅ 지붕 윤곽 완성! 이제 &quot;📐 패널 배치 계산&quot; 버튼을 클릭하세요
              </div>
            </div>
          )}

          <Statistics stats={stats} />
          <InstructionText text={instructionText} />
        </div>
      </div>
    </div>
  );
};
