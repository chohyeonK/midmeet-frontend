import React, { useEffect, useState } from 'react';
import MidPlaceItem from './MidPlaceItem';
import MidPlaceDetail from './MidPlaceDetail';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { Bs1CircleFill } from 'react-icons/bs';
import CourseRouteViewer from './CourseRouteViewer';

// 데이터 정의
// interface RecommendedPlace {
//     placeId: string;
//     placeName: string;
//     address: string;
//     lat: number;      // 필수: 지오코딩된 위도
//     lng: number;      // 필수: 지오코딩된 경도
//     hitMenu: string;  // 부가 정보
//     review: string;   // 부가 정보
// }

// // 2. 코스 객체 (CourseList 배열에 들어가는 형태)
// interface PartyCourse {
//     courseNo: number;       // 1, 2, 3 순번
//     tag: string;            // '음식점', '카페' (목적)
//     // ✅ 사용자가 최종 선택한 장소 정보를 여기에 저장합니다.
//     selectedPlace: RecommendedPlace | null;
// }

// // 3. 모임 전체 데이터 (최종 상태)
// interface PartyData {
//     partyName: string;
//     partyDate: Date | null;
//     midPoint: string; // 중간 지점 이름 (예: '선릉역')
//     courseList: PartyCourse[]; // 코스 목록 배열
// }

interface RecommendedPlace {
  placeId: number;
  placeName: string;
  address: string;
  hitMenu: string;
  review: string;
}

interface PartyCourse {
  courseNo: number;
  courseName: string;
  selectedPlace: RecommendedPlace | null; // 이걸 나중에 장소 고유 id로 받으면 될듯
}

interface PartyData {
  partyName: string;
  partyDate: string;
  midPoint: string;
  courseList: PartyCourse[];
}

// 추천 장소 임시 데이터
const foodList = [
  {
    placeId: 1,
    placeName: '000 고깃집',
    address: '경기도 안산시',
    hitMenu: '차돌 볶음',
    review: '정말 맛있어용!!',
  },
  {
    placeId: 2,
    placeName: '00 김밥천국',
    address: '경기도 부천시',
    hitMenu: '참치땡초김밥',
    review: '정말 김밥이 끝내주네용!!',
  },
  {
    placeId: 3,
    placeName: '000 파스타',
    address: '경기도 과천시',
    hitMenu: '쉬림프 로제 파스타',
    review: '파스타가 굉장히 맛있어요.',
  },
  {
    placeId: 4,
    placeName: '000 쌈밥집',
    address: '경기도 이천시',
    hitMenu: '우렁 쌈밥',
    review: '쌈밥하면 이집입니다!',
  },
  {
    placeId: 5,
    placeName: '프레디의 피자가게',
    address: '경기도 수원시',
    hitMenu: '오리지널 피자',
    review: '피자를 사면 곰이 와요..',
  },
];

const cafeList = [
  {
    placeId: 1,
    placeName: '투썸플레이스',
    address: '경기도 수원시',
    hitMenu: '말차라떼',
    review: '아이스박스 보다 꿀맛',
  },
  {
    placeId: 1,
    placeName: '스타벅스',
    address: '경기도 안산시',
    hitMenu: '콘파냐',
    review: '쌉싸름해용',
  },
  {
    placeId: 1,
    placeName: '이디야',
    address: '경기도 수원시',
    hitMenu: '수박주스',
    review: '생으로 갈은 수박이라 꿀맛!!',
  },
];

const shoppingList = [
  {
    placeId: 10,
    placeName: '스타필드 코엑스',
    address: '서울특별시 강남구',
    hitMenu: '영풍문고, 카카오프렌즈',
    review: '하루종일 놀기 좋아요.',
  },
  {
    placeId: 11,
    placeName: '더현대 서울',
    address: '서울특별시 영등포구',
    hitMenu: '층별 팝업 스토어',
    review: '트렌디한 장소!',
  },
];

const MidFindingContainer: React.FC<PartyData> = ({ partyName, partyDate, midPoint, courseList }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(courseList);
  const [recommendList, setRecommendList] = useState<RecommendedPlace[] | null>(null);
  const [placeData, setPlaceData] = useState<RecommendedPlace | null>(null);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  const totalCourses = courseList.length;
  const isFirst = currentCourseIndex === 0;
  const isLast = currentCourseIndex === totalCourses - 1;

  useEffect(() => {
    setTimeout(() => {
      loadRecommendList();
    }, 1000);
  }, [currentCourseIndex]);

  const loadRecommendList = () => {
    let newRecommend: RecommendedPlace[] = [];

    switch (currentCourseIndex) {
      case 0: // 첫 번째 코스 (Index 0)
        newRecommend = foodList;
        break;
      case 1: // 두 번째 코스 (Index 1)
        newRecommend = cafeList;
        break;
      case 2: // 세 번째 코스 (Index 2)
        newRecommend = shoppingList;
        break;
      default:
        // 코스 인덱스가 범위를 벗어날 경우 대비
        newRecommend = [];
        break;
    }

    setRecommendList(newRecommend);
    setPlaceData(newRecommend[0]);
  };

  const openPlaceDetail = (place: RecommendedPlace): void => {
    console.log('누른 장소', place);
    setPlaceData(place);

    // 전체 경로 갱신
    const updatedList = [...courses];
    const updatedCourse = {
      ...courseList[currentCourseIndex],

      courseName: place.placeName,
    };
    updatedList[currentCourseIndex] = updatedCourse;

    setCourses(updatedList);
  };

  const handlePrev = () => {
    console.log('이전 버튼 클릭', currentCourseIndex);
    setCurrentCourseIndex((prev) => prev - 1);
    loadRecommendList();
  };

  const handleNext = () => {
    console.log('다음 버튼 클릭', currentCourseIndex);
    setCurrentCourseIndex((next) => next + 1);
    loadRecommendList();
  };

  const sumbitData = () => {
    console.log('저장 버튼 클릭');

    const submitPartyData = {
      party_name: partyName,
      party_date: partyDate,
      midPoint: midPoint,
      courseList: courses,
    };

    console.log(submitPartyData);
    navigate('/midpoint/success');
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='text-left mb-2 text-lg font-medium text-gray-700'>모임명: {partyName}</div>
      <div className='flex flex-col md:flex-row items-start md:items-end mb-8 text-left'>
        <div className='text-3xl font-semibold text-mint-500 mr-4'>중간지점: {midPoint}</div>
        <div className='text-lg font-medium text-gray-700 mt-2 md:mt-0'>날짜: {partyDate}</div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm'>지도</div>

        {/* 컴포넌트로 빼기 */}
        <div className='col-span-1 p-4 bg-white border border-gray-200 rounded-lg shadow-sm'>
          <CourseRouteViewer courses={courses} currentIndex={currentCourseIndex} />
        </div>
      </div>
      <div className='mb-6'>
        <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>장소를 골라주세요!</div>
        <div className='flex flex-nowrap overflow-x-auto space-x-4 items-stretch'>
          {recommendList &&
            recommendList.map((place, index) => {
              return <MidPlaceItem key={place.placeName} index={index} data={place} onClickDetail={openPlaceDetail} />;
            })}
        </div>
      </div>
      {placeData && <MidPlaceDetail place={placeData} />}

      <div className='flex justify-end'>
        {!isFirst && <Button buttonName='이전' className='mr-3 bg-gray-900' onClick={handlePrev} />}
        {!isLast && <Button buttonName='다음' onClick={handleNext} className='mr-3 ' />}
        <Button buttonName='저장' className='bg-gray-900' onClick={sumbitData} />
      </div>
    </div>
  );
};

export default MidFindingContainer;
