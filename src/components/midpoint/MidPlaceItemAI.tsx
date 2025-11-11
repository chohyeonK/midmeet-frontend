import React from 'react';
import Button from '../common/Button';
import type { AIRecommendPlace, RecommendedPlace } from '../../types/MidFindTypes';
import type { ViewMode } from '../../types/MidCommonTypes';

interface MidPlaceItemProps {
  index: number;
  data: AIRecommendPlace;
  onClickDetail?: (place: AIRecommendPlace) => void;
}

const MidPlaceItemAI: React.FC<MidPlaceItemProps> = ({ index, data, onClickDetail }) => {
  const { courseName, places } = data;

  return (
    <div className='flex flex-col h-full justify-between text-left min-w-48 w-64 mr-3 p-6 bg-white border border-gray-200 rounded-lg shadow-sm'>
      {/* 🎯 제목: courseName 사용 */}
      <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900'>{courseName}</h5>

      {/* 🎯 본문: places 배열의 장소 이름 요약 */}
      <div className='font-normal text-gray-700'>
        {places.map((place, index) => (
          <div>
            {index + 1}번째: {place.placeName}
          </div>
        ))}
      </div>

      <div className='mt-4'>
        <Button onClick={() => onClickDetail && onClickDetail(data)} buttonName='코스 선택' className='w-full' />
      </div>
    </div>
  );
};

export default MidPlaceItemAI;
