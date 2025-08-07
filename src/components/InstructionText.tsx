import React from 'react';

interface InstructionTextProps {
  text: string;
}

export const InstructionText: React.FC<InstructionTextProps> = ({ text }) => {
  return (
    <div 
      className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-800"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
