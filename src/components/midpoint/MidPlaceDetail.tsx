import React from 'react';
import type { AIRecommendPlace, CourseMode, RecommendedPlace } from '../../types/MidFindTypes';

interface PlaceDetailProps {
  mode: CourseMode;
  index?: number;
  place: RecommendedPlace;
}

const MidPlaceDetail: React.FC<PlaceDetailProps> = ({ mode, index, place }) => {
  const shouldRenderIndex = index !== undefined && index !== null;
  return (
    <div className='text-left bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
      {mode === 'CUSTOM_COURSE' && <h5 className='mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 pb-3'>자세히 보기</h5>}
      {mode === 'AI_COURSE' && shouldRenderIndex && <h5 className='mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 pb-3'>{index + 1}번째 장소</h5>}
      <div className='flex'>
        <div className='col-span-1 mr-6'>
          <img src='https://placehold.co/200x150/00C48C/fff?text=Course+Image' alt='장소 대표 이미지' className='w-full h-auto rounded-lg' />
        </div>
        <div className='col-span-2'>
          <div className='text-left'>
            <div className='text-2xl font-bold mb-2'>{place.placeName}</div>
            <div className='text-gray-700'>주소 | {place.placeAddr}</div>
            <div className='text-gray-700'>주요 메뉴 | {place.hitMenu}</div>
            <div className='text-gray-700'>주요 리뷰 | {place.review}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidPlaceDetail;
