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
      {/* 💡 [개선]: 안내 문구 굵기(font-medium) 및 섹션 하단 마진(mb-4) 추가 */}
      <div className='my-4 mb-4 text-xl font-medium text-gray-700 text-left'>중간 지점 추천 방식을 선택해주세요!</div>

      {/* ------------------- 1. 사용자 코스 지정 ------------------- */}
      <div
        // 💡 [개선]: 버튼 간 마진(mb-3) 추가 및 hover 효과
        className={`px-6 py-4 border-2 rounded-xl cursor-pointer transition duration-200 mb-3 
            ${
              data.midpointMethod === 'CUSTOM_COURSE'
                ? 'bg-mint-500 border-mint-500 text-white shadow-lg' // 선택됨: 민트색 강조
                : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-mint-300' // 미선택
            }`}
        onClick={handleCustomClick}
      >
        <div className='text-lg font-semibold'>사용자 코스 지정</div>
        <div className='text-sm mt-1 opacity-80'>선택된 장소를 직접 코스에 추가합니다.</div>
      </div>

      {/* ------------------- 2. AI 추천 코스 지정 ------------------- */}
      <div
        // 💡 [개선]: 버튼 간 마진(mb-3) 추가 및 hover 효과
        className={`px-6 py-4 border-2 rounded-xl cursor-pointer transition duration-200 mb-3 
            ${
              data.midpointMethod === 'AI_COURSE'
                ? 'bg-mint-500 border-mint-500 text-white shadow-lg' // 선택됨: 민트색 강조
                : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-mint-300' // 미선택
            }`}
        onClick={handleAIClick}
      >
        <div className='text-lg font-semibold'>AI 추천 코스 지정</div>
        <div className='text-sm mt-1 opacity-80'>AI가 도출한 최적의 코스 목록을 선택합니다.</div>
      </div>
    </div>
  );
};

export default StepMethod;
