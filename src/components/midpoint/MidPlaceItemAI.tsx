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
    <div className='flex flex-col h-full justify-between text-left min-w-48 w-64 mr-3 p-0 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      {/* 1. 이미지 영역 (첫 번째 장소만 표시) */}
      {places.length > 0 && places[0].imageUrl && (
        <img
          src={places[0].imageUrl}
          alt={`${courseName} 1번째 장소`}
          className='w-full h-40 object-cover' // 이미지 높이 고정 (h-40) 및 꽉 채우기
        />
      )}

      {/* 2. 정보 섹션 (패딩 추가, 원본 카드와 유사하게 pt-0을 제외한 p-4 유지) */}
      <div className='p-4'>
        {/* 🎯 제목: courseName 사용 (녹색 텍스트) */}
        <h5 className='mb-2 text-xl font-bold tracking-tight text-green-600 dark:text-green-400'>{courseName}</h5>

        {/* 🎯 본문: places 배열의 장소 이름 요약 */}
        <div className='font-normal text-gray-700 dark:text-gray-400 text-sm'>
          {/* 장소 목록을 모두 출력 (원래 로직 유지) */}
          {places.map((place, index) => (
            // key prop은 map을 사용할 때 필수입니다.
            <div key={index}>
              {index + 1}번째: {place.placeName}
            </div>
          ))}
        </div>

        {/* 여백 확보용 div (필요시) */}
        <div className='h-3'></div>
      </div>

      {/* 3. 버튼 영역 (맨 아래 고정) */}
      <div className='mt-auto p-4 pt-0'>
        {' '}
        {/* mt-auto로 하단에 붙이고, 상단 패딩 제거 */}
        <Button
          onClick={() => onClickDetail && onClickDetail(data)}
          buttonName='코스 선택'
          // 장소 상세 정보 카드와 동일한 녹색 버튼 스타일 적용
          className='w-full items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800'
        />
      </div>
    </div>
  );
};

export default MidPlaceItemAI;
