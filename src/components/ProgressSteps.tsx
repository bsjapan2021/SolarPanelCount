import React from 'react';
import { MapPin, Satellite, Calculator, FileText } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, text: '주소 입력', icon: MapPin },
    { number: 2, text: '지붕 추출', icon: Satellite },
    { number: 3, text: '패널 배치', icon: Calculator },
    { number: 4, text: 'CAD 생성', icon: FileText }
  ];

  return (
    <div className="relative">
      {/* 프로그래스 바 배경 */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-white/20 rounded-full mx-8"></div>
      
      {/* 프로그래스 바 */}
      <div 
        className="absolute top-6 left-0 h-1 bg-white rounded-full mx-8 transition-all duration-500 ease-out"
        style={{ width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * (100 - 4))}%` }}
      ></div>
      
      <div className="flex justify-between items-center px-4 relative z-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300
                ${isCompleted ? 'bg-green-500 text-white shadow-lg scale-110' : 
                  isActive ? 'bg-white text-blue-600 shadow-lg scale-110 border-2 border-blue-200' : 'bg-white/20 text-white/70 border-2 border-white/30'}
              `}>
                {isCompleted ? '✓' : <Icon className="w-6 h-6" />}
              </div>
              <div className={`text-sm text-center font-medium transition-all duration-300 ${
                isActive ? 'text-white font-bold' : 
                isCompleted ? 'text-green-100 font-semibold' : 'text-white/70'
              }`}>
                {step.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
