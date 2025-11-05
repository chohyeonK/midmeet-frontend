import React from 'react';
import Button from '../common/Button';

interface RecommendedPlace {
  placeId: number;
  placeName: string;
  address: string;
  hitMenu: string;
  review: string;
}

interface MidPlaceItemProps {
  index: number;
  data: RecommendedPlace;
  onClickDetail: (place: RecommendedPlace) => void;
}

const MidPlaceItem: React.FC<MidPlaceItemProps> = ({ index, data, onClickDetail }) => {
  return (
    <div className='flex flex-col h-full justify-between text-left min-w-48 w-64 mr-3 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      {/* 제목 링크 */}
      <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>{data.placeName}</h5>

      {/* 본문 내용 */}
      <p className='mb-3 font-normal text-gray-700 dark:text-gray-400 h-10'>인기메뉴: {data.hitMenu}</p>

      {/* Read More 버튼 */}
      <div className='flex justify-end mt-4'>
        <Button
          onClick={() => onClickDetail(data)}
          buttonName='선택'
          className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        />
      </div>
    </div>
  );
};

export default MidPlaceItem;
