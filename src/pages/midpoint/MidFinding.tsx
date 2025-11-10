import React, { useCallback, useEffect, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import Loading from '../../components/common/Loading';
import { foodList, cafeList, shoppingList, initialPartyData, AI_RECOMMENDATION_OPTIONS } from '../../data/mockRecommend';
import type { RecommendedPlace, PartyData, AiRecommendPlace } from '../../types/MidFindTypes';
import { useNavigate } from 'react-router-dom';

const MidFinding: React.FC = () => {
  const navigate = useNavigate();
  const midMode = 'FIND';
  const midType = initialPartyData.courseType;

  const [courses, setCourses] = useState(initialPartyData.courseList);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(initialPartyData.currentCourseIndex);
  const [recommendList, setRecommendList] = useState<RecommendedPlace[] | null>(null);
  const [aiRecommendList, setAiRecommendList] = useState<AiRecommendPlace[] | null>(null);
  const [placeData, setPlaceData] = useState<RecommendedPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalCourses = courses.length;
  const isFirst = currentCourseIndex === 0;
  const isLast = currentCourseIndex === totalCourses - 1;
  const partyInfo = {
    partyName: initialPartyData.partyName,
    partyDate: initialPartyData.partyDate,
    midPoint: initialPartyData.midPoint,
    courseType: midType,
  };

  // 2. 추천 리스트 로드 로직 (currentCourseIndex가 바뀔 때 실행, ai/custom 분기 처리)
  const loadRecommendList = useCallback(() => {
    let newRecommend: RecommendedPlace[] = []; // CUSTOM 모드용

    if (midType === 'AI_COURSE') {
      // ✅ 1. AI 모드일 때: AI 추천 옵션 배열 전체를 설정
      // AI_RECOMMENDATION_OPTIONS 배열을 그대로 사용합니다.
      setAiRecommendList(AI_RECOMMENDATION_OPTIONS);
      console.log('++++++++++++', aiRecommendList);
      setPlaceData(null); // AI 모드에서는 상세 장소 대신 코스 카드를 선택하므로 상세 정보를 초기화
      return;
    }

    // ✅ 2. CUSTOM 모드일 때: 인덱스별 리스트를 설정 (기존 로직)
    switch (currentCourseIndex) {
      case 0:
        newRecommend = foodList;
        break;
      case 1:
        newRecommend = cafeList;
        break;
      case 2:
        newRecommend = shoppingList;
        break;
      default:
        newRecommend = [];
        break;
    }

    setRecommendList(newRecommend);

    // 현재 코스에 선택된 장소가 없다면, 새 리스트의 첫 번째 장소를 상세 정보로 설정
    const selectedPlace = courses[currentCourseIndex]?.selectedPlace;
    setPlaceData(selectedPlace || newRecommend[0] || null);
  }, [currentCourseIndex, courses]); // courses 의존성 추가 (선택된 장소 확인용)

  // 3. '이전/다음' 버튼 핸들러 (useCallback 사용)
  const handlePrev = useCallback(() => {
    console.log('이전 버튼 클릭');
    if (!isFirst) {
      setCurrentCourseIndex((prev) => prev - 1);
    }
  }, [isFirst]);

  const handleNext = useCallback(() => {
    console.log('다음 버튼 클릭');
    if (!isLast) {
      setCurrentCourseIndex((next) => next + 1);
    }
  }, [isLast]);

  // 4. 장소 선택/상세 보기 핸들러 (useCallback 사용)
  const onPlaceSelect = useCallback(
    (place: RecommendedPlace): void => {
      console.log('장소 선택 클릭', place);
      setPlaceData(place);

      // 선택된 장소를 코스 리스트(state)에 반영
      setCourses((prevCourses) => {
        const updatedCourses = [...prevCourses];
        updatedCourses[currentCourseIndex] = {
          ...updatedCourses[currentCourseIndex],
          courseName: place.placeName,
          selectedPlace: place, // 장소 정보 전체 저장
        };
        return updatedCourses;
      });
    },
    [currentCourseIndex],
  ); // currentCourseIndex가 바뀔 때만 재생성

  // 5. 최종 데이터 제출 핸들러 (저장 버튼)
  const sumbitData = useCallback(() => {
    console.log('최종 저장 버튼 클릭', { ...partyInfo, courseList: courses });
    // 서버 전송 로직 구현
    navigate('/midpoint/success');
  }, [courses, navigate, partyInfo]);

  // 6. useEffect: 초기 로딩 및 currentCourseIndex 변경 감지
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      loadRecommendList();
    }, 1000);
    return () => clearTimeout(loadingTimer);
  }, [loadRecommendList]); // loadRecommendList가 바뀔 때마다 실행 (currentCourseIndex가 바뀐다는 의미)

  if (isLoading) {
    return <Loading title='최적의 만남 장소를 분석하고 있습니다.' message='잠시만 기다려주세요!' />;
  }

  // MidContainer로 전달할 최종 Props 구성
  const midContainerProps: PartyData = {
    ...partyInfo,
    courseList: courses,
    currentCourseIndex: currentCourseIndex,
    recommendList: recommendList,
    aiRecommendList: aiRecommendList,
    placeData: placeData,
  };

  return (
    <>
      <MidContainer mode={midMode} resultData={midContainerProps} handlePrev={handlePrev} handleNext={handleNext} handleSave={sumbitData} onPlaceSelect={onPlaceSelect} />
    </>
  );
};

export default MidFinding;
