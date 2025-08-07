# 🌞 Solar Panel Design System

AI 기반 태양광 패널 설계 시스템 - Google Maps API를 활용한 지능형 태양광 패널 배치 설계 도구

## 🌟 주요 기능

### 📍 주소 검색 및 위성 이미지

- **무제한 주소 검색**: Google Geocoding API를 통한 전 세계 주소 검색
- **실시간 위성 이미지**: Google Maps Static API를 활용한 고해상도 위성사진
- **동적 줌 컨트롤**: 15-21 줌 레벨 지원으로 정밀한 지붕 분석

### 🏠 지붕 설계 도구

- **인터랙티브 지붕 그리기**: 마우스 클릭으로 지붕 윤곽선 그리기
- **실시간 면적 계산**: 다각형 면적 자동 계산
- **시각적 피드백**: 점 연결 및 완성 상태 실시간 표시

### ⚡ 패널 설정 최적화

- **커스터마이징 가능한 패널 규격**: 폭, 높이, 간격, 여백 조정
- **실시간 계산**: 패널 개수, 총 용량, 연간 발전량 자동 계산
- **효율성 분석**: 지붕 면적 대비 최적 배치 분석

### 📐 AutoCAD 연동

- **LISP 코드 자동 생성**: AutoCAD에서 바로 사용 가능한 LISP 파일
- **좌표 기반 설계**: 정확한 좌표 정보를 포함한 도면 생성
- **자동 다운로드**: 설계 완료 시 즉시 LISP 파일 다운로드

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.4.6, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS
- **APIs**: Google Maps Static API, Google Geocoding API
- **Icons**: Lucide React
- **Development**: VS Code, Git

## 🚀 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/bsjapan2021/SolarPanelCount.git
cd SolarPanelCount
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 Google Maps API 키를 설정하세요:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📖 사용 방법

### 1단계: 주소 입력

- 검색창에 원하는 주소를 입력합니다
- 자동완성 목록에서 정확한 주소를 선택합니다
- "위성사진 로드" 버튼을 클릭합니다

### 2단계: 지붕 윤곽 그리기

- 위성사진에서 지붕의 모서리를 시계방향으로 클릭합니다
- 첫 번째 점(빨간 점) 근처를 클릭하여 윤곽을 완성합니다
- 지붕 면적이 자동으로 계산됩니다

### 3단계: 패널 설정

- 패널 크기, 간격, 용량 등을 조정합니다
- 실시간으로 패널 개수와 발전량이 계산됩니다

### 4단계: AutoCAD 파일 생성

- "AutoCAD LISP 파일 생성" 버튼을 클릭합니다
- 자동으로 `.lsp` 파일이 다운로드됩니다
- AutoCAD에서 해당 파일을 로드하여 사용하세요

## 🗺️ API 설정

### Google Maps API 키 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Maps Static API와 Geocoding API 활성화
3. API 키 생성 및 도메인 제한 설정
4. `.env.local` 파일에 API 키 추가

### 지원되는 API

- **Google Maps Static API**: 위성 이미지 제공
- **Google Geocoding API**: 주소를 좌표로 변환

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── geocode/route.ts      # 주소 -> 좌표 변환 API
│   │   └── satellite/route.ts    # 위성 이미지 API
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx               # 레이아웃 컴포넌트
│   └── page.tsx                 # 메인 페이지
└── components/
    ├── AddressInput.tsx         # 주소 입력 컴포넌트
    ├── PanelSettings.tsx        # 패널 설정 컴포넌트
    ├── ProgressSteps.tsx        # 진행 단계 표시
    ├── RoofCanvas.tsx           # 지붕 그리기 캔버스
    ├── SatelliteImageViewer.tsx # 위성 이미지 뷰어
    ├── SolarPanelSystem.tsx     # 메인 시스템 컴포넌트
    └── Statistics.tsx           # 통계 및 결과 표시
```

## 🔧 개발 환경 설정

### Node.js 버전 요구사항

- Node.js 18.18.0 이상

### 개발 도구

- VS Code (권장)
- Git
- Chrome/Safari/Firefox (최신 버전)

## 📊 계산 공식

### 지붕 면적 계산

```javascript
// 신발끈 공식(Shoelace formula) 사용
let area = 0;
for (let i = 0; i < points.length; i++) {
  const j = (i + 1) % points.length;
  area += points[i].x * points[j].y;
  area -= points[j].x * points[i].y;
}
area = Math.abs(area) / 2;
```

### 패널 개수 계산

```javascript
const panelArea = panelWidth * panelHeight;
const effectiveArea = roofArea * 0.8; // 80% 효율성
const panelCount = Math.floor(effectiveArea / panelArea);
```

### 연간 발전량 계산

```javascript
const annualProduction = panelCount * panelCapacity * 1200; // kWh/년
```

## 🌐 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 기타 배포 플랫폼

- Netlify
- AWS Amplify
- Heroku

## 🤝 기여

프로젝트에 기여하고 싶으시다면:

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

- **개발자**: bsjapan2021
- **이메일**: bsjapan@naver.com
- **GitHub**: [https://github.com/bsjapan2021](https://github.com/bsjapan2021)
- **프로젝트 링크**: [https://github.com/bsjapan2021/SolarPanelCount](https://github.com/bsjapan2021/SolarPanelCount)

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!
