import React, { useCallback, useEffect, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import type { PartyData, PartyCourse } from '../../types/MidCommonTypes'; // PartyCourse 추가
import type { AIRecommendPlace, MidFindData, RecommendedPlace } from '../../types/MidFindTypes';
import { MOCK_FOOD_LIST, MOCK_CAFE_LIST, MOCK_SHOPPING_LIST, MOCK_MID_FIND_INITIAL_DATA, MOCK_AI_RECOMMEND_LIST } from '../../data/mockRecommend';

const MidFinding: React.FC = () => {
  const navigate = useNavigate();
  // 초기 기본 모임 데이터 세팅
  const initParty = MOCK_MID_FIND_INITIAL_DATA;
  const midMode = 'FIND';
  const midCourseMode = initParty.courseMode;

  const partyInfo = {
    partyName: initParty.party.partyName,
    partyDate: initParty.party.partyDate,
    midPoint: initParty.party.midPoint,
    midPointLat: initParty.party.midPointLat,
    midPointLng: initParty.party.midPointLng,
  };

  const [courses, setCourses] = useState<PartyCourse[]>(initParty.party.courses);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(initParty.currentCourseIndex);
  const [recommendList, setRecommendList] = useState<RecommendedPlace[] | null>(null);
  const [aiRecommendList, setAiRecommendList] = useState<AIRecommendPlace[] | null>(null);
  const [placeData, setPlaceData] = useState<RecommendedPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalCourses = courses.length;
  const isFirst = currentCourseIndex === 0;
  const isLast = currentCourseIndex === totalCourses - 1;

  // 2. 추천 리스트 로드 로직 (currentCourseIndex가 바뀔 때 실행, ai/custom 분기 처리)
  const loadRecommendList = useCallback(() => {
    let newRecommend: RecommendedPlace[] = []; // CUSTOM 모드용
    let newAIRecommend: AIRecommendPlace[] = [];

    if (midCourseMode === 'AI_COURSE') {
      // ... (AI 모드 로직 주석 유지 또는 구현) ...
      newAIRecommend = MOCK_AI_RECOMMEND_LIST;
    }

    // ✅ 2. CUSTOM 모드일 때: 인덱스별 리스트를 설정
    switch (currentCourseIndex) {
      case 0:
        newRecommend = MOCK_FOOD_LIST;
        break;
      case 1:
        newRecommend = MOCK_CAFE_LIST;
        break;
      case 2:
        newRecommend = MOCK_SHOPPING_LIST;
        break;
      default:
        newRecommend = [];
        break;
    }

    setRecommendList(newRecommend);
    setAiRecommendList(newAIRecommend);

    // 🎯 현재 코스에 이미 선택된 장소 데이터가 있는지 확인합니다.
    const selectedPlace = courses[currentCourseIndex]?.places;

    // 💡 [수정] 이미 선택된 장소가 없다면, 새 리스트의 첫 번째 장소를 상세 정보로 설정
    // placeName이 '미정'이거나 placeId가 초기값(900 등)인 경우를 '미선택'으로 간주
    if (selectedPlace && selectedPlace.placeName !== '미정' && selectedPlace.placeId !== 900) {
      setPlaceData(selectedPlace);
    } else {
      setPlaceData(newRecommend[0] || null);
    }
  }, [currentCourseIndex, courses, midCourseMode]); // midCourseMode 의존성 추가

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

      // ✅ [수정] 선택된 장소의 모든 정보를 코스 리스트(state)에 반영
      setCourses((prevCourses) => {
        const updatedCourses = [...prevCourses];
        updatedCourses[currentCourseIndex] = {
          ...prevCourses[currentCourseIndex], // 기존 courseNo 복사

          // 🎯 places 속성 전체를 선택된 장소 (place)의 모든 정보로 교체
          places: place,
        };
        return updatedCourses;
      });
    },
    [currentCourseIndex], // courses 의존성은 제거하여 불필요한 loadRecommendList 재실행 방지
  );

  // ai 코스 선택
  const onCourseIndexSelect = useCallback(
    (selectedIndex: number) => {
      // 1. 선택된 AI 코스 객체의 places 배열 (RecommendedPlace[])을 가져옵니다.
      const selectedPlacesArray = aiRecommendList?.[selectedIndex]?.places;

      if (!selectedPlacesArray || selectedPlacesArray.length === 0) {
        console.warn(`선택된 인덱스 ${selectedIndex}에 대한 장소 목록이 비어 있습니다.`);
        return;
      }

      const newCourses: PartyCourse[] = selectedPlacesArray.map((place, index) => {
        return {
          courseNo: index + 1,
          places: place,
        } as PartyCourse;
      });

      setCourses(newCourses);

      // 4. 인덱스를 첫 번째 코스로 초기화
      setCurrentCourseIndex(0);
    },
    [aiRecommendList, setCourses, setCurrentCourseIndex, setPlaceData],
  );

  // 5. 최종 데이터 제출 핸들러 (저장 버튼)
  const sumbitData = useCallback(() => {
    console.log('최종 저장 버튼 클릭', { ...partyInfo, courses: courses });
    // 서버 전송 로직 구현
    navigate('/midpoint/success');
  }, [courses, navigate, partyInfo]);

  // 6. useEffect: 초기 로딩 및 currentCourseIndex 변경 감지
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      loadRecommendList();
      console.log('✅ useEffect에서 확인한 최종 변경된 코스:', courses);
    }, 1000);
    return () => clearTimeout(loadingTimer);
  }, [loadRecommendList]);

  if (isLoading) {
    return <Loading title='최적의 만남 장소를 분석하고 있습니다.' message='잠시만 기다려주세요!' />;
  }

  // MidContainer로 전달할 최종 Props 구성
  const midContainerProps: MidFindData = {
    party: {
      ...partyInfo,
      courses: courses,
    } as PartyData,
    courseMode: midCourseMode,
    customRecommendList: recommendList,
    aiRecommendList: aiRecommendList,
    currentCourseIndex: currentCourseIndex,
    placeData: placeData,
  };

  return (
    <>
      <MidContainer
        mode={midMode}
        resultData={midContainerProps}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleSave={sumbitData}
        onPlaceSelect={onPlaceSelect}
        onPlaceAISelect={onCourseIndexSelect}
      />
    </>
  );
};

export default MidFinding;
