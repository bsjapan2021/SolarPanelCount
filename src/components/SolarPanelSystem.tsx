'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Satellite } from 'lucide-react';
import { ProgressSteps } from './ProgressSteps';
import { AddressInput } from './AddressInput';
import { PanelSettings } from './PanelSettings';
import { SatelliteImageViewer } from './SatelliteImageViewer';
import RoofCanvas from './RoofCanvas';
import { Statistics } from './Statistics';

interface Point {
  x: number;
  y: number;
}

interface Location {
  address: string;
  lat: number;
  lng: number;
}

const koreanAddresses: Location[] = [
  { address: '서울특별시 강남구 테헤란로 152', lat: 37.5057, lng: 127.0521 },
  { address: '서울특별시 중구 세종대로 110', lat: 37.5636, lng: 126.9759 },
  { address: '서울특별시 종로구 청와대로 1', lat: 37.5866, lng: 126.9748 },
  { address: '서울시 성동구 왕십리로322', lat: 37.5607, lng: 127.0374 },
  { address: '부산광역시 해운대구 우동', lat: 35.1595, lng: 129.1600 },
  { address: '대구광역시 중구 동성로', lat: 35.8714, lng: 128.6014 },
  { address: '인천광역시 중구 공항로 272', lat: 37.4691, lng: 126.4503 },
  { address: '광주광역시 동구 금남로', lat: 35.1468, lng: 126.9204 },
  { address: '대전광역시 유성구 대학로', lat: 36.3651, lng: 127.3736 },
  { address: '울산광역시 남구 삼산로', lat: 35.5372, lng: 129.3114 },
  { address: '수원시 영통구 월드컵로 206', lat: 37.2570, lng: 127.0313 },
  { address: '성남시 분당구 정자로 24', lat: 37.3626, lng: 127.1063 },
  { address: '고양시 일산동구 중앙로 1200', lat: 37.6550, lng: 126.7706 },
  { address: '용인시 수지구 풍덕천로 152', lat: 37.3217, lng: 127.1017 },
  { address: '안양시 동안구 시민대로 230', lat: 37.3943, lng: 126.9568 },
  { address: '안산시 단원구 광덕대로 205', lat: 37.3236, lng: 126.8219 },
  { address: '의정부시 의정부동 222-1', lat: 37.7381, lng: 127.0338 },
  { address: '평택시 비전동 909', lat: 36.9910, lng: 127.1127 },
  { address: '시흥시 정왕동 1488', lat: 37.3740, lng: 126.8031 },
  { address: '파주시 금촌동 1077', lat: 37.7595, lng: 126.7801 },
  { address: '김포시 사우동 201', lat: 37.6156, lng: 126.7162 },
  { address: '광명시 하안동 61', lat: 37.4768, lng: 126.8664 },
  { address: '구리시 인창동 543', lat: 37.5943, lng: 127.1295 },
  { address: '남양주시 호평동 592', lat: 37.6369, lng: 127.2467 },
  { address: '오산시 원동 159', lat: 37.1498, lng: 127.0772 },
  { address: '이천시 부발읍 경충대로 2709', lat: 37.2028, lng: 127.4354 },
  { address: '안성시 공도읍 서동대로 4600', lat: 37.0057, lng: 127.2734 },
  { address: '의왕시 고천동 240', lat: 37.3449, lng: 126.9684 },
  { address: '하남시 신장동 520', lat: 37.5394, lng: 127.2065 },
  { address: '여주시 세종로 1', lat: 37.2984, lng: 127.6371 },
  { address: '양평군 양평읍 공원로 19', lat: 37.4911, lng: 127.4874 },
  { address: '가평군 가평읍 가평대로 268', lat: 37.8313, lng: 127.5110 },
  { address: '연천군 연천읍 연천로 220', lat: 38.0962, lng: 127.0745 },
  { address: '포천시 소흘읍 호국로 1663', lat: 37.8950, lng: 127.2006 },
  { address: '동두천시 생연동 169', lat: 37.9034, lng: 127.0609 },
  { address: '과천시 중앙동 1-1', lat: 37.4289, lng: 126.9876 },
];

const SolarPanelSystem = () => {
  // 상태 관리
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [satelliteImageUrl, setSatelliteImageUrl] = useState('');
  const [roofPoints, setRoofPoints] = useState<Point[]>([]);
  const [isRoofComplete, setIsRoofComplete] = useState(false);
  const [instructionText, setInstructionText] = useState('🏠 <strong>주소를 입력</strong>하여 위성사진을 불러오세요.');
  const [zoomLevel, setZoomLevel] = useState(19);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  // 패널 설정
  const [panelWidth, setPanelWidth] = useState(2);
  const [panelHeight, setPanelHeight] = useState(1);
  const [panelSpacing, setPanelSpacing] = useState(0.1);
  const [borderMargin, setBorderMargin] = useState(0.5);
  const [panelCapacity, setPanelCapacity] = useState(400);

  // 계산된 값들
  const [roofArea, setRoofArea] = useState(0);
  const [panelCount, setPanelCount] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [annualProduction, setAnnualProduction] = useState(0);

  // 주소 자동완성 핸들러
  const handleAddressSearch = (query: string) => {
    const filteredAddresses = koreanAddresses.filter(addr =>
      addr.address.toLowerCase().includes(query.toLowerCase())
    );
    return filteredAddresses.slice(0, 5);
  };

  // 위성사진 로드 핸들러
  const handleLoadSatellite = async () => {
    console.log('위성사진 로드 시작...', { selectedAddress, currentLocation });
    
    if (!selectedAddress) {
      setInstructionText('❌ 먼저 주소를 입력해주세요.');
      return;
    }
    
    if (!currentLocation) {
      setInstructionText('❌ 주소를 목록에서 선택해주세요. 자동완성 목록에서 정확한 주소를 클릭하세요.');
      return;
    }
    
    setCurrentStep(2);
    setProgress(50);
    setInstructionText('📍 주소가 설정되었습니다!<br/>🛰️ 위성사진을 불러오는 중...');
    
    try {
      await loadSatelliteImage(currentLocation, zoomLevel);
    } catch (error) {
      console.error('위성사진 로드 중 오류 발생:', error);
      setInstructionText('❌ 위성사진 로드 실패. 다시 시도해주세요.');
    }
  };

  // 주소 선택 핸들러
  const handleAddressSelect = async (address: string) => {
    setSelectedAddress(address);
    
    // 먼저 로컬 데이터베이스에서 찾기
    const localLocation = koreanAddresses.find(addr => addr.address === address);
    
    if (localLocation) {
      setCurrentLocation(localLocation);
      setMapCenter({ lat: localLocation.lat, lng: localLocation.lng });
      console.log('로컬 데이터베이스에서 주소 찾음:', localLocation);
      return;
    }
    
    // 로컬에 없으면 Google Geocoding API 사용
    console.log('Google Geocoding API로 주소 검색 중...', address);
    setInstructionText('🔍 주소를 검색하는 중...');
    
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.success) {
        const newLocation: Location = {
          address: data.address,
          lat: data.lat,
          lng: data.lng
        };
        setCurrentLocation(newLocation);
        setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
        console.log('Google API에서 주소 찾음:', newLocation);
        setInstructionText('✅ 주소가 설정되었습니다! 위성사진 로드 버튼을 클릭하세요.');
      } else {
        console.error('주소 검색 실패:', data.error);
        setInstructionText('❌ 주소를 찾을 수 없습니다. 다른 주소를 입력해보세요.');
        setCurrentLocation(null);
      }
    } catch (error) {
      console.error('Geocoding 오류:', error);
      setInstructionText('❌ 주소 검색 중 오류가 발생했습니다.');
      setCurrentLocation(null);
    }
  };

  // 위성 이미지 로드
  const loadSatelliteImage = async (location: Location, zoom: number, centerLat?: number, centerLng?: number) => {
    const lat = centerLat || location.lat;
    const lng = centerLng || location.lng;
    
    console.log('API 호출 시작:', { lat, lng, zoom });
    
    try {
      const apiUrl = `/api/satellite?lat=${lat}&lng=${lng}&zoom=${zoom}&size=600x400`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('API 응답:', response.status, response.statusText);

      if (response.ok) {
        const blob = await response.blob();
        console.log('Blob 크기:', blob.size);
        
        const imageUrl = URL.createObjectURL(blob);
        console.log('이미지 URL 생성:', imageUrl);
        
        setSatelliteImageUrl(imageUrl);
        setInstructionText('🛰️ 위성사진이 로드되었습니다!<br/>🏠 이제 지붕 윤곽을 그려주세요. 첫 번째 모서리를 클릭하세요.');
      } else {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        throw new Error(`API 오류: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('위성 이미지 로드 실패:', error);
      setInstructionText('❌ 위성사진 로드 실패. 네트워크 연결을 확인하고 다시 시도해보세요.');
    }
  };

  // 줌 레벨 변경 핸들러
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
  };

  // 줌 변경 시 자동으로 위성 이미지 새로고침
  useEffect(() => {
    if (currentLocation) {
      loadSatelliteImage(currentLocation, zoomLevel, mapCenter.lat, mapCenter.lng);
    }
  }, [zoomLevel, mapCenter]);

  // 지도 이동 핸들러
  const handlePanChange = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentLocation) return;
    
    const panDistance = 0.002; // 이동 거리 (위도/경도 단위)
    
    let newLat = mapCenter.lat;
    let newLng = mapCenter.lng;
    
    switch (direction) {
      case 'up':
        newLat += panDistance;
        break;
      case 'down':
        newLat -= panDistance;
        break;
      case 'left':
        newLng -= panDistance;
        break;
      case 'right':
        newLng += panDistance;
        break;
    }
    
    setMapCenter({ lat: newLat, lng: newLng });
  };

  // 지붕 클릭 핸들러
  const handleRoofClick = (point: Point) => {
    // 지붕 완성 신호 확인 (RoofCanvas에서 보낸 특별한 신호)
    if (point.x === -1 && point.y === -1) {
      setIsRoofComplete(true);
      setProgress(75);
      setCurrentStep(3);
      setInstructionText('✅ 지붕 윤곽 완성!<br/>📐 지붕 면적이 계산되었습니다.<br/>🔧 이제 패널 설정을 조정하고 최종 도면을 생성하세요.');
      calculatePanelLayout(roofPoints);
      return;
    }

    if (!isRoofComplete) {
      const newPoints = [...roofPoints, point];
      setRoofPoints(newPoints);
      
      if (newPoints.length === 1) {
        setInstructionText('🎯 첫 번째 점을 설정했습니다!<br/>계속해서 지붕의 모서리를 <strong>시계방향</strong>으로 클릭하세요.<br/>💡 첫 번째 점 근처를 클릭하면 지붕 윤곽이 완성됩니다.');
      } else if (newPoints.length >= 3) {
        setInstructionText(`🎯 점 ${newPoints.length}개 설정됨<br/>첫 번째 점(빨간 점) 근처를 클릭하여 완성하세요.`);
      } else {
        setInstructionText(`🎯 점 ${newPoints.length}개 설정됨<br/>최소 3개 점이 필요합니다. 계속 클릭하세요.`);
      }
    }
  };

  // 패널 레이아웃 계산
  const calculatePanelLayout = useCallback((points: Point[]) => {
    if (points.length < 3) return;

    // 다각형 면적 계산 (신발끈 공식)
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;

    // 픽셀을 미터로 변환 (대략적인 변환 비율)
    const pixelToMeter = 0.05; // 1픽셀 = 0.05미터로 가정
    const areaInSqMeters = area * pixelToMeter * pixelToMeter;
    
    setRoofArea(areaInSqMeters);

    // 패널 수 계산
    const panelArea = panelWidth * panelHeight;
    const effectiveArea = areaInSqMeters * 0.8; // 80% 효율성 가정
    const calculatedPanelCount = Math.floor(effectiveArea / panelArea);
    
    setPanelCount(calculatedPanelCount);
    setTotalCapacity(calculatedPanelCount * panelCapacity);
    setAnnualProduction(calculatedPanelCount * panelCapacity * 1200); // 연간 1200kWh/kW 가정
  }, [panelWidth, panelHeight, panelCapacity]);

  // 패널 설정 변경 핸들러
  useEffect(() => {
    if (isRoofComplete) {
      calculatePanelLayout(roofPoints);
    }
  }, [panelWidth, panelHeight, panelSpacing, borderMargin, panelCapacity, isRoofComplete, roofPoints, calculatePanelLayout]);

  // AutoCAD LISP 코드 생성
  const generateLispCode = () => {
    if (!isRoofComplete || roofPoints.length === 0) return;

    const lispCode = `
; Solar Panel Layout AutoCAD LISP Code
; Generated on ${new Date().toLocaleDateString()}
; Address: ${selectedAddress}

(defun c:solar-panel-layout ()
  (setq roof-points (list
${roofPoints.map((point) => `    '(${point.x.toFixed(1)} ${point.y.toFixed(1)})`).join('\n')}
  ))
  
  ; Draw roof outline
  (command "_PLINE")
  (foreach pt roof-points
    (command pt)
  )
  (command "_C")  ; Close polyline
  
  ; Panel specifications
  (setq panel-width ${panelWidth})
  (setq panel-height ${panelHeight})
  (setq panel-spacing ${panelSpacing})
  (setq border-margin ${borderMargin})
  
  ; Calculate panel positions
  (setq panel-count 0)
  (setq start-x (+ (caar roof-points) border-margin))
  (setq start-y (+ (cadar roof-points) border-margin))
  
  ; Draw panels (simplified rectangular layout)
  (setq current-x start-x)
  (setq current-y start-y)
  
  (repeat ${Math.floor(panelCount / 10)})  ; Rows
    (setq current-x start-x)
    (repeat 10)  ; Panels per row
      (command "_RECTANGLE" 
               (list current-x current-y)
               (list (+ current-x panel-width) (+ current-y panel-height)))
      (setq current-x (+ current-x panel-width panel-spacing))
      (setq panel-count (1+ panel-count))
    )
    (setq current-y (+ current-y panel-height panel-spacing))
  )
  
  ; Add text annotations
  (command "_TEXT"
           (list ${roofPoints[0]?.x || 0} ${(roofPoints[0]?.y || 0) - 50})
           "10"
           (strcat "Solar Panel Layout - " "${selectedAddress}")
  )
  (command "_TEXT"
           (list ${roofPoints[0]?.x || 0} ${(roofPoints[0]?.y || 0) - 70})
           "8"
           (strcat "Total Panels: " (itoa panel-count))
  )
  (command "_TEXT"
           (list ${roofPoints[0]?.x || 0} ${(roofPoints[0]?.y || 0) - 90})
           "8"
           (strcat "Total Capacity: " "${totalCapacity}" "W")
  )
  
  (princ "\\nSolar panel layout completed!")
)

; Run the command
(c:solar-panel-layout)
`;

    // 파일 다운로드
    const blob = new Blob([lispCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar-panel-layout.lsp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setProgress(100);
    setInstructionText('🎉 AutoCAD LISP 파일이 생성되어 다운로드되었습니다!<br/>📁 파일을 AutoCAD에서 로드하여 사용하세요.');
  };

  const resetSystem = () => {
    setCurrentStep(1);
    setProgress(25);
    setSelectedAddress('');
    setCurrentLocation(null);
    setSatelliteImageUrl('');
    setRoofPoints([]);
    setIsRoofComplete(false);
    setInstructionText('🏠 <strong>주소를 입력</strong>하여 위성사진을 불러오세요.');
    setZoomLevel(19);
    setMapCenter({ lat: 0, lng: 0 });
    setRoofArea(0);
    setPanelCount(0);
    setTotalCapacity(0);
    setAnnualProduction(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <Satellite className="w-8 h-8" />
              <h1 className="text-2xl font-bold">AI 태양광 패널 설계 시스템</h1>
            </div>
            <ProgressSteps currentStep={currentStep} />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="p-6">
            {/* 지시사항 */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div 
                className="text-blue-800 font-medium"
                dangerouslySetInnerHTML={{ __html: instructionText }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽 컬럼: 입력 패널 */}
              <div className="lg:col-span-1 space-y-6">
                {/* 1단계: 주소 입력 */}
                <div className={`transition-all duration-300 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>1</div>
                      <h3 className="font-semibold text-gray-800">주소 입력</h3>
                    </div>
                    <AddressInput
                      value={selectedAddress}
                      onAddressSelect={handleAddressSelect}
                      onSearch={handleLoadSatellite}
                      zoomLevel={zoomLevel}
                      onZoomChange={handleZoomChange}
                      onPanChange={handlePanChange}
                    />
                  </div>
                </div>

                {/* 3단계: 패널 설정 */}
                <div className={`transition-all duration-300 ${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>3</div>
                      <h3 className="font-semibold text-gray-800">패널 설정</h3>
                    </div>
                    <PanelSettings
                      panelWidth={panelWidth}
                      panelHeight={panelHeight}
                      panelSpacing={panelSpacing}
                      borderMargin={borderMargin}
                      panelCapacity={panelCapacity}
                      onPanelWidthChange={setPanelWidth}
                      onPanelHeightChange={setPanelHeight}
                      onPanelSpacingChange={setPanelSpacing}
                      onBorderMarginChange={setBorderMargin}
                      onPanelCapacityChange={setPanelCapacity}
                      disabled={!isRoofComplete}
                    />
                  </div>
                </div>

                {/* 통계 및 다운로드 */}
                <div className={`transition-all duration-300 ${isRoofComplete ? 'opacity-100' : 'opacity-50'}`}>
                  <Statistics
                    roofArea={roofArea}
                    panelCount={panelCount}
                    totalCapacity={totalCapacity}
                    annualProduction={annualProduction}
                    onGenerateLisp={generateLispCode}
                    onReset={resetSystem}
                    canGenerate={isRoofComplete}
                  />
                </div>
              </div>

              {/* 오른쪽 컬럼: 지도 및 캔버스 */}
              <div className="lg:col-span-2">
                {/* 2단계: 위성 이미지 */}
                <div className={`mb-4 transition-all duration-300 ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>2</div>
                      <h3 className="font-semibold text-gray-800">지붕 윤곽 그리기</h3>
                      {satelliteImageUrl && (
                        <span className="text-xs text-gray-500 ml-auto">줌 레벨: {zoomLevel}</span>
                      )}
                    </div>
                    
                    {satelliteImageUrl ? (
                      <div className="space-y-4">
                        <SatelliteImageViewer 
                          imageUrl={satelliteImageUrl} 
                          showMarker={true}
                          markerPosition={{ x: 50, y: 50 }}
                        />
                        <RoofCanvas
                          onRoofClick={handleRoofClick}
                          roofPoints={roofPoints}
                          isComplete={isRoofComplete}
                        />
                      </div>
                    ) : (
                      <div className="h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>주소를 선택하면 위성사진이 표시됩니다</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarPanelSystem;
