import React, { useEffect, useState } from 'react';
import MidPlaceItem from '../midpoint/MidPlaceItem';
import MidPlaceDetail from '../midpoint/MidPlaceDetail';
import Button from '../common/Button';

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

interface PlaceItem {
  placeId: number;
  placeName: string;
  address: string;
  hitMenu: string;
  review: string;
}

interface MidFindingProps {
  partyName: string;
  partyDate: string;
  midPoint: string;
}

interface Course {
  courseId: string;
  courseNo: number;
  courseName: string;
}

// 추천 장소 예시 데이터
const foodList = [
  {
    placeId: 1,
    placeName: '000 고깃집',
    hitMenu: '차돌 볶음',
  },
  {
    placeId: 2,
    placeName: '00 김밥천국',
    hitMenu: '참치땡초김밥',
  },
  {
    placeId: 3,
    placeName: '000 파스타',
    hitMenu: '쉬림프 로제 파스타',
  },
  {
    placeId: 4,
    placeName: '000 파스타',
    hitMenu: '44 쉬림프 로제 파스타',
  },
  {
    placeId: 5,
    placeName: '000 파스타',
    hitMenu: '55 쉬림프 로제 파스타',
  },
  {
    placeId: 6,
    placeName: '000 파스타',
    hitMenu: '66 쉬림프 로제 파스타',
  },
  {
    placeId: 7,
    placeName: '000 파스타',
    hitMenu: '77 쉬림프 로제 파스타',
  },
];

const cafeList = [
  {
    placeId: 1,
    placeName: '투썸플레이스',
    hitMenu: '그린티 라떼',
  },
  {
    placeId: 2,
    placeName: '스타벅스',
    hitMenu: '아인슈페너',
  },
  {
    placeId: 3,
    placeName: '카페 파구스',
    hitMenu: '토피넛 라떼',
  },
];

const MidFindingContainer: React.FC<MidFindingProps> = ({ partyName, partyDate, midPoint }) => {
  const initialPlace = midPlaceList.length > 0 ? midPlaceList[0] : null;
  const [placeData, setPlaceData] = useState<PlaceItem | null>(initialPlace);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [recommendList, setRecommendList] = useState<PlaceItem[] | null>(null);
  const totalCourses = courseList.length;
  const isFirst = currentCourseIndex === 0;
  const isLast = currentCourseIndex === totalCourses - 1;

  useEffect(() => {
    setTimeout(() => {
      setCourseList([
        { courseId: 'c1', courseNo: 1, courseName: '미지정' },
        { courseId: 'c2', courseNo: 2, courseName: '미지정' },
        { courseId: 'c3', courseNo: 3, courseName: '미지정' },
      ]);
    }, 1000);
  }, []);

  const openPlaceDetail = (place: PlaceItem): void => {
    console.log('누른 장소', place);
    setPlaceData(place);
    const updatedList = [...courseList];
    const updatedCourse = {
      ...courseList[currentCourseIndex],

      courseName: place.placeName, // 임시 편집 상태의 값으로 갱신
    };
    updatedList[currentCourseIndex] = updatedCourse;

    setCourseList(updatedList);
  };

  const loadRecommendList = () => {
    const newRecommend = currentCourseIndex === 0 ? midPlaceList : cafeList;
    setRecommendList(newRecommend);
  };

  const handlePrev = () => {
    console.log('이전 버튼 클릭');
    setCurrentCourseIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    console.log('다음 버튼 클릭');
    setCurrentCourseIndex((next) => next + 1);

    // 추천 리스트 가져오는 함수 호출
    loadRecommendList();
  };

  return (
    <div>
      <div className='text-left mb-6 text-2xl font-semibold text-gray-900'>모임명: {partyName}</div>
      <div className='text-left mb-6 text-lg font-semibold text-gray-900'>날짜: {partyDate}</div>
      <div className='text-left mb-6 text-2xl font-semibold text-gray-900'>중간지점: {midPoint}</div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-3 ...'>지도</div>
        <div className='...'>
          <div>전체 경로</div>
          {courseList &&
            courseList.map((course, index) => (
              <div className='flex'>
                <div className='w-14 flex-none ...'>{course.courseNo}</div>
                <div className='flex-1 ...'>{course.courseName}</div>
              </div>
            ))}
        </div>
      </div>
      <div className='mb-6'>
        <div className='text-left mb-3 text-xl font-semibold text-gray-900'>'밥집'을 골라주세요!</div>
        <div className='flex flex-nowrap'>
          {recommendList &&
            recommendList.map((place, index) => {
              return <MidPlaceItem key={place.placeName} index={index} data={place} onClickDetail={openPlaceDetail} />;
            })}
        </div>
      </div>
      {placeData && <MidPlaceDetail place={placeData} />}

      <div className='flex'>
        {!isFirst && <Button buttonName='이전' className='mr-3 bg-gray-900' onClick={handlePrev} />}
        <Button buttonName='저장' className='mr-3 bg-gray-900' />
        {!isLast && <Button buttonName='다음' onClick={handleNext} />}
      </div>
    </div>
  );
};

export default MidFindingContainer;
