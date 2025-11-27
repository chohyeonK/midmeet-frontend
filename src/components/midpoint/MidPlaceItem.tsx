import React from 'react';
import Button from '../common/Button';
import type { RecommendedPlace } from '../../types/MidFindTypes';
import type { ViewMode } from '../../types/MidCommonTypes';

interface MidPlaceItemProps {
  index: number;
  data: RecommendedPlace;
  onClickDetail?: (place: RecommendedPlace) => void;
  mode: ViewMode;
}

const MidPlaceItem: React.FC<MidPlaceItemProps> = ({ index, data, onClickDetail, mode }) => {
  // 이미지가 없을 때를 대비한 플레이스홀더 스타일
  const imagePlaceholderStyle = 'h-1/2 w-full object-cover mb-2 bg-gray-300 rounded-t-lg';

  return (
    // 전체 컨테이너 스타일 조정 (그림자 및 여백 유지)
    <div className='flex flex-col h-full justify-between text-left min-w-48 w-64 mr-3 p-0 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      {/* 이미지 또는 플레이스홀더 영역 */}
      {data.imageUrl ? (
        <img src={data.imageUrl} className='h-[130px] w-full object-cover mb-2 rounded-t-lg' alt={data.placeName} />
      ) : (
        // 이미지 없을 때 회색 플레이스홀더
       
        <img src='https://placehold.co/200x150/00C48C/fff?text=Empty+Image' className='h-1/2 w-full object-cover mb-2 rounded-t-lg' alt={data.placeName} />
        // <div className={imagePlaceholderStyle} style={{ height: '150px', minHeight: '150px' }}></div>
      )}

      {/* 정보 섹션 (패딩 추가) */}
      <div className='p-4 pt-0'>
        {/* 장소 이름 - 이미지의 녹색 텍스트와 비슷하게 조정 */}
        <h5 className='mb-2 text-xl font-bold tracking-tight text-green-600 dark:text-green-400'>{data.placeName}</h5>
        
        {/* 주소 */}
        <p className='font-normal text-gray-700 dark:text-gray-400 text-sm'>{data.placeAddr}</p>

        {/* 인기 메뉴 */}
        {data.hitMenu && (
          <p className='mb-3 font-normal text-gray-700 dark:text-gray-400 h-10 text-sm'>
            인기 메뉴: <span className='font-medium'>{data.hitMenu}</span>
          </p>
        )}

        {/* 버튼 영역 */}
        <div className='mt-4'>
          {mode === 'FIND' && (
            <Button
              onClick={() => onClickDetail && onClickDetail(data)}
              buttonName='선택'
              // 이미지의 녹색 버튼 스타일로 변경 (bg-blue-700 -> bg-teal-500/600 계열)
              className='w-full items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800'
            />
          )}
          {mode === 'VIEW' && (
            <Button
              onClick={() => onClickDetail && onClickDetail(data)}
              buttonName='자세히 보기'
              // 이미지의 녹색 버튼 스타일로 변경
              className='w-full items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MidPlaceItem;