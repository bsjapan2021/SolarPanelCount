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
    <div className="flex justify-between items-center mb-8 px-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        
        return (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2
              ${isCompleted ? 'bg-green-500 text-white' : 
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}
            `}>
              {isCompleted ? '✓' : <Icon className="w-6 h-6" />}
            </div>
            <div className={`text-sm text-center font-medium ${
              isActive || isCompleted ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {step.text}
            </div>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block absolute h-0.5 w-24 mt-6 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} style={{ left: `${((index + 1) * 25) - 12.5}%` }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
