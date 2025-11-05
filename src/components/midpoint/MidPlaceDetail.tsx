import React from 'react';

interface RecommendedPlace {
  placeId: number;
  placeName: string;
  address: string;
  hitMenu: string;
  review: string;
}

interface PlaceDetailProps {
  place: RecommendedPlace;
}

const MidPlaceDetail: React.FC<PlaceDetailProps> = ({ place }) => {
  return (
    // <div className='text-left grid grid-cols-3 gap-4 bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
    //   <h5 className='mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>{place.placeName}</h5>

    //   <div className='col-span-1'>사진</div>
    //   <div className='col-span-2'>
    //     <div className='text-left'>
    //       <h5 className='mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>{place.placeName}</h5>
    //       <div>주소 {place.address}</div>
    //       <div>주요 메뉴 {place.hitMenu}</div>
    //       <div>주요 리뷰 {place.review}</div>
    //     </div>
    //   </div>
    // </div>
    <div className='text-left bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
      <h5 className='mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 pb-3'>선택된 장소</h5>
      <div className='flex'>
        <div className='col-span-1 mr-6'>
          <img src='https://placehold.co/200x150/00C48C/fff?text=Course+Image' alt='장소 대표 이미지' className='w-full h-auto rounded-lg' />
        </div>
        <div className='col-span-2'>
          <div className='text-left'>
            <div className='text-2xl font-bold mb-2'>{place.placeName}</div>
            <div className='text-gray-700'>주소 | {place.address}</div>
            <div className='text-gray-700'>주요 메뉴 | {place.hitMenu}</div>
            <div className='text-gray-700'>주요 리뷰 | {place.review}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidPlaceDetail;
