import React from 'react';

// [Mock] 실제 환경에서는 외부 파일에서 가져오는 타입 정의 및 Button 컴포넌트
type RecommendedPlace = {
  placeName: string;
  placeAddr: string;
  imageUrl?: string;
  placeUrl: string;
  hitMenu?: string;
  review?: string;
};
type CourseMode = 'CUSTOM_COURSE' | 'AI_COURSE';
interface PlaceDetailProps {
  mode: CourseMode;
  index?: number;
  place: RecommendedPlace;
}
const Button: React.FC<{
  onClick: () => void;
  buttonName: string;
  className: string;
}> = ({ onClick, buttonName, className }) => (
  <button onClick={onClick} className={className}>
    {buttonName}
  </button>
);
// ---------------------------------------------------

const MidPlaceDetail: React.FC<PlaceDetailProps> = ({ mode, index, place }) => {
  const shouldRenderIndex = index !== undefined && index !== null;

  // 새 탭 열기 함수 (handleUrl)
  const handleUrl = (url: string) => {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      // 팝업 차단 메시지 처리 (console 대신 사용자에게 보이는 메시지 박스 사용 권장)
      console.error('팝업 차단으로 인해 새 탭을 열 수 없습니다.');
    }
  };

  return (
    <div className='text-left bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
      {/* 제목 영역 */}
      {mode === 'CUSTOM_COURSE' && <h5 className='mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 pb-3'>자세히 보기</h5>}
      {mode === 'AI_COURSE' && shouldRenderIndex && <h5 className='mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 pb-3'>{index + 1}번째 장소</h5>}

      {/* 메인 컨텐츠 영역: flex로 이미지와 내용을 좌우 정렬 */}
      <div className='flex'>
        {/* 1. 이미지 컬럼 */}
        <div className='mr-6 flex-shrink-0'>
          <img src={place.imageUrl || 'https://placehold.co/200x150/00C48C/fff?text=Empty+Image'} alt='장소 대표 이미지' className='w-[230px] h-auto rounded-lg' />
        </div>

        {/* 2. 컨텐츠 컬럼: 버튼을 하단에 고정시키기 위한 수직 Flexbox 설정 */}
        <div className='flex flex-col flex-grow justify-between min-h-[150px]'>
          {/* 상단 텍스트 내용 */}
          <div className='text-left'>
            <div className='text-2xl font-bold mb-2'>{place.placeName}</div>
            <div className='text-gray-700'>주소 | {place.placeAddr}</div>
            {/* 주석 처리된 내용 */}
            {/* <div className='text-gray-700'>주요 메뉴 | {place.hitMenu}</div>
            <div className='text-gray-700'>주요 리뷰 | {place.review}</div> */}
          </div>

          {/* 버튼 영역: self-end와 mt-4를 사용하여 오른쪽 하단에 고정 */}
          <div className='mt-4 self-end'>
            <Button
              buttonName='자세히 보기'
              className='bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-500 text-sm shadow-md transition duration-150'
              onClick={() => handleUrl(place.placeUrl)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidPlaceDetail;
