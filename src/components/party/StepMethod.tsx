import React, { useState } from 'react';

interface StepMethodData {
  midpointMethod: string;
}

interface StepMethodProps {
  data: StepMethodData;
  onUpdateFormData: (data: Partial<StepMethodData>) => void;
}

const StepMethod: React.FC<StepMethodProps> = ({ data, onUpdateFormData }) => {
  const handleCustomClick = () => {
    onUpdateFormData({ midpointMethod: 'CUSTOM_COURSE' });
  };

  const handleAIClick = () => {
    onUpdateFormData({ midpointMethod: 'AI_COURSE' });
  };
  return (
    <div>
      <div className='my-4 text-lg text-gray-500 text-left'>
        중간 지점 추천 <br />
        방식을 선택해주세요!
      </div>
      <div className={`px-4 py-2 border rounded-md cursor-pointer ${data.midpointMethod === 'CUSTOM_COURSE' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`} onClick={handleCustomClick}>
        사용자 코스 지정
      </div>
      <div className={`px-4 py-2 border rounded-md cursor-pointer ${data.midpointMethod === 'AI_COURSE' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`} onClick={handleAIClick}>
        AI 추천 코스 지정
      </div>
    </div>
  );
};

export default StepMethod;
