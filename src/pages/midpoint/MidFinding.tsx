import React, { useCallback, useEffect, useRef, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import Loading from '../../components/common/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import type { PartyData, PartyCourse } from '../../types/MidCommonTypes';
import type { AIRecommendPlace, MidFindData, RecommendedPlace } from '../../types/MidFindTypes';
import { MOCK_FOOD_LIST, MOCK_CAFE_LIST, MOCK_SHOPPING_LIST, MOCK_AI_RECOMMEND_LIST } from '../../data/mockRecommend';
import axios from 'axios';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const getTokenFromStorage = () => localStorage.getItem('token') || null;

// 백엔드에서 받은 개별 코스 단계 데이터 (places: 객체)
interface BackendItem {
  courseId: string;
  courseName: string;
  courseNo: number;
  places: RecommendedPlace; // 이 타입은 이미 정의되어 있다고 가정
}

const convertDataToAIRecommend = (backendData: { list: BackendItem[][] }): AIRecommendPlace[] => {
  console.log('들어옴?????');
  // 1. 유효성 검사 (list가 있는지 확인)
  if (!backendData || !backendData.list || backendData.list.length === 0) {
    return [];
  }
  console.log('백엔드 데이터 리스트: ', backendData.list);

  // 🚨 [핵심 수정]: 3차원 배열을 1차원 배열로 평탄화합니다.
  // Array.prototype.flat() 메서드를 사용합니다.
  // 이 결과 'flattenedList'는 { courseId: 'cm18...', ... } 객체들의 배열이 됩니다.
  const flattenedList: BackendItem[] = backendData.list.flat();
  console.log('평탄화된 리스트: ', flattenedList);

  if (flattenedList.length === 0) {
    console.warn('평탄화 후 리스트가 비어있습니다.');
    return [];
  }

  const result: AIRecommendPlace[] = [];
  const groupedCourses = new Map<string, BackendItem[]>();

  // 2. courseId를 기준으로 데이터를 그룹화 (평탄화된 리스트 사용)
  for (const item of flattenedList) {
    // ✅ item은 이제 BackendItem 객체입니다.
    // 🚨 item.courseId가 숫자형(0, 1)이므로 Map의 키로 사용하기 위해 문자열로 변환합니다.
    const key = String(item.courseId);

    if (!groupedCourses.has(key)) {
      groupedCourses.set(key, []);
    }
    groupedCourses.get(key)?.push(item);
  }

  console.log('그룹화된 코스 데이터: ', groupedCourses);

  // ... (나머지 로직은 동일) ...

  return result;
};

// 초기 partyInfo 구조를 위한 타입 정의 (PartyData에서 courses를 제외한 부분)
const initialPartyInfo = {
  partyName: '',
  partyDate: '',
  midPoint: '',
  midPointLat: 0,
  midPointLng: 0,
  partyType: '',
};

type CourseMode = 'AI_COURSE' | 'CUSTOM_COURSE';

const MidFinding: React.FC = () => {
  const didMount = useRef(false);

  const { partyId } = useParams();
  const token = getTokenFromStorage();

  const navigate = useNavigate();
  const midMode = 'FIND';

  // 1. 초기 기본 모임 데이터 세팅을 API 응답을 기다리는 상태로 변경
  const [midCourseMode, setMidCourseMode] = useState<CourseMode | null>(null);
  const [partyInfo, setPartyInfo] = useState(initialPartyInfo); // partyInfo 상태 추가
  const [courses, setCourses] = useState<PartyCourse[]>([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  const [recommendList, setRecommendList] = useState<RecommendedPlace[] | null>(null);
  const [aiRecommendList, setAiRecommendList] = useState<AIRecommendPlace[] | null>(null);
  const [placeData, setPlaceData] = useState<RecommendedPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태는 true

  const totalCourses = courses.length;
  const isFirst = currentCourseIndex === 0;
  const isLast = currentCourseIndex === totalCourses - 1;

  const [cachedRecommendLists, setCachedRecommendLists] = useState<Map<number, RecommendedPlace[]>>(new Map());

  // 2. 추천 리스트 로드 로직 (currentCourseIndex가 바뀔 때 실행, ai/custom 분기 처리)
  // const loadRecommendList = useCallback(() => {
  //   let newRecommend: RecommendedPlace[] = [];
  //   let newAIRecommend: AIRecommendPlace[] = [];

  //   // midCourseMode가 설정되지 않았다면 리턴
  //   if (!midCourseMode) return;

  //   if (midCourseMode === 'AI_COURSE') {
  //     // ... (AI 모드 로직 주석 유지 또는 구현) ...
  //     newAIRecommend = MOCK_AI_RECOMMEND_LIST;
  //     setAiRecommendList(newAIRecommend);
  //   } else {
  //     // 사용자 추천 코스
  //     console.log('장소 세팅: ', newRecommend);
  //     setRecommendList(newRecommend);
  //   }

  //   // ✅ 2. CUSTOM 모드일 때: 인덱스별 리스트를 설정
  //   // switch (currentCourseIndex) {
  //   //   case 0:
  //   //     newRecommend = MOCK_FOOD_LIST;
  //   //     break;
  //   //   case 1:
  //   //     newRecommend = MOCK_CAFE_LIST;
  //   //     break;
  //   //   case 2:
  //   //     newRecommend = MOCK_SHOPPING_LIST;
  //   //     break;
  //   //   default:
  //   //     newRecommend = [];
  //   //     break;
  //   // }

  //   // 🎯 이미 선택된 장소가 없다면, 새 리스트의 첫 번째 장소를 상세 정보로 설정 (원래 로직 유지)
  //   // 이 로직이 courses에 의존하지 않도록 수정해야 재귀 호출을 막을 수 있습니다.
  //   // 현재 courses를 직접 참조하는 로직은 주석 처리되어 있으므로, dependencies에서 courses만 제거합니다.
  // }, [currentCourseIndex, midCourseMode]); // courses 의존성 제거: 장소 선택 시 불필요한 재실행 방지

  // 받은 데이터 프론트가 원하는 형식으로 변환하는 함수
  const convertDataFront = (data: any) => {
    // data 타입은 백엔드 응답 구조에 맞게 수정 필요
    // console.log('받은 데이터!!!!!!!!!!!!!!!!!!!!!!: ', data);
    const { party, list } = data;
    // console.log('받은 리스트 데이터@@@@@@@@@@: ', list);
    const { partyName, partyDate, midPoint, midPointLat, midPointLng, partyType, courses } = party;

    // 1. midCourseMode 상태 업데이트
    setMidCourseMode(partyType);

    // 2. partyInfo 상태 업데이트
    const newPartyInfo = {
      partyName: partyName,
      partyDate: partyDate,
      midPoint: midPoint,
      midPointLat: midPointLat,
      midPointLng: midPointLng,
      partyType: partyType,
    };
    setPartyInfo(newPartyInfo);

    // 3. courses 상태 업데이트
    setCourses(courses);

    // 4. 첫번째 장소 추천 리스트
    if (partyType === 'AI_COURSE') {
      // console.log('AI 코스 데이터 변환 중: ', list);
      // const aiCourses = convertDataToAIRecommend(list);
      // console.log('////변환된 AI 코스 데이터: ', aiCourses);

      setAiRecommendList(list);
    } else {
      setRecommendList(list);
    }
    if (list && list.length > 0) {
      setCachedRecommendLists((prev) => {
        const newMap = new Map(prev);
        newMap.set(0, list); // ✅ 인덱스 0 (첫 코스) 리스트 캐싱
        return newMap;
      });
      // (선택 사항: 첫 코스의 첫 장소를 상세 정보로 설정)
      // setPlaceData(list[0] || null);
    }
    // loadRecommendList()

    // 4. 로딩 상태 해제
    // setIsLoading(false);

    // console.log('변환 후 설정된 partyInfo: ', newPartyInfo);
  };

  const getPartyAndCourse = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${baseURL}/party/${partyId}/mid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('데이터 세팅: ', response);
      convertDataFront(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // ← 성공/실패 후 딱 한 번만 상태 변경
    }
  };

  // 3. '이전/다음' 버튼 핸들러 (useCallback 사용) - 변경 없음
  const handlePrev = useCallback(() => {
    if (!isFirst) {
      const prevIndex = currentCourseIndex - 1;

      // 캐시 확인
      const prevRecommendList = cachedRecommendLists.get(prevIndex);
      // console.log(prevIndex);
      // const courseIndexId = courses[prevIndex].courseId;

      if (prevRecommendList) {
        // console.log(`✅ 캐시 히트: 코스 ${prevIndex} 리스트를 캐시에서 로드합니다.`);
        setRecommendList(prevRecommendList); // 이전 코스의 리스트를 로드
        setPlaceData(courses[prevIndex].places);
      } else {
        setPlaceData(null);
      }

      // 페이지 인덱스 이동
      setCurrentCourseIndex(prevIndex);
    }
  }, [isFirst, currentCourseIndex, cachedRecommendLists, setRecommendList]);

  const handleNext = useCallback(async () => {
    if (!isLast) {
      const nextIndex = currentCourseIndex + 1;
      let nextRecommendList: RecommendedPlace[] | undefined;

      // 1. 캐시 확인: 다음 코스의 리스트가 이미 있는지 확인
      if (cachedRecommendLists.has(nextIndex)) {
        // console.log(`✅ 캐시 히트: 코스 ${nextIndex} 리스트를 캐시에서 로드합니다.`);
        nextRecommendList = cachedRecommendLists.get(nextIndex);
        console.log(courses[nextIndex].places);
        setPlaceData(courses[nextIndex].places);
      } else if (placeData !== null) {
        // 2. 캐시 미스 & 장소 선택 완료: API 호출
        const { lat, lng } = placeData;
        try {
          setIsLoading(true);
          const baseURL = import.meta.env.VITE_API_URL;
          const courseIndexId = courses[nextIndex].courseId;

          const response = await axios.get(`${baseURL}/party/course_list/${partyId}/${courseIndexId}`, {
            params: { lat, lng, course_list: courseIndexId, party_id: partyId },
            headers: { Authorization: `Bearer ${token}` },
          });

          // console.log(`📡 API 성공: 코스 ${courseIndexId} 리스트를 서버에서 로드했습니다.`);

          // TODO: 받은 데이터를 nextRecommendList에 할당하고, 캐시에 저장
          const receivedList = response.data.list; // 실제 API 응답 구조에 맞게 수정 필요

          setCachedRecommendLists((prev) => {
            const newMap = new Map(prev);
            newMap.set(nextIndex, receivedList);
            return newMap;
          });

          nextRecommendList = receivedList;
          setPlaceData(null);
        } catch (error) {
          console.error('API 오류:', error);
          alert('시스템 에러가 발생하였습니다. 잠시후에 다시 시도해주세요.');
        } finally {
          setIsLoading(false);
        }
      }

      // 3. 상태 업데이트 및 페이지 이동

      // 캐시 또는 API를 통해 다음 리스트를 가져왔다면, setRecommendList에 반영
      if (nextRecommendList) {
        setRecommendList(nextRecommendList);
      } else {
        // 장소 선택을 안 했거나 API 호출에 실패했을 경우: 이전 리스트를 유지하거나 빈 리스트로 설정
        setRecommendList([]);
      }

      setCurrentCourseIndex(nextIndex);
    }
  }, [
    isLast,
    placeData,
    currentCourseIndex,
    partyId,
    token,
    cachedRecommendLists,
    setCachedRecommendLists,
    setRecommendList, // 캐싱 관련 상태 및 세터 추가
  ]);

  // 4. 장소 선택/상세 보기 핸들러 (useCallback 사용) - 변경 없음
  const onPlaceSelect = useCallback(
    (place: RecommendedPlace): void => {
      // console.log('선택한 장소: ', place);
      setPlaceData(place);

      setCourses((prevCourses) => {
        const updatedCourses = [...prevCourses];
        updatedCourses[currentCourseIndex] = {
          ...prevCourses[currentCourseIndex],
          places: place,
        };
        return updatedCourses;
      });
    },
    [currentCourseIndex],
  );

  // ai 코스 선택 - 변경 없음
  const onCourseIndexSelect = useCallback(
    (selectedIndex: number) => {
      const selectedPlacesArray = aiRecommendList?.[selectedIndex]?.places;

      if (!selectedPlacesArray || selectedPlacesArray.length === 0) {
        console.warn(`선택된 인덱스 ${selectedIndex}에 대한 장소 목록이 비어 있습니다.`);
        return;
      }

      const newCourses: PartyCourse[] = selectedPlacesArray.map((place, index) => {
        return {
          courseId: aiRecommendList?.[selectedIndex].courseId,
          courseNo: index + 1,
          places: place,
        } as PartyCourse;
      });

      // console.log('새로 클릭함 코스: ', newCourses);

      setCourses(newCourses);

      setCurrentCourseIndex(0);
      setPlaceData(newCourses[0].places); // 첫 코스의 첫 장소를 상세 정보로 설정
    },
    [aiRecommendList], // setCourses, setCurrentCourseIndex, setPlaceData 의존성은 간결화를 위해 제거 가능
  );

  // MidFinding.tsx 내부

  const sumbitData = useCallback(async () => {
    // console.log('최종 저장 버튼 클릭', { ...partyInfo, courses: courses });
    let payloadCourses = [];
    let requestBody = {};

    if (partyInfo.partyType === 'AI_COURSE') {
      payloadCourses = courses.map((courseItem) => {
        // console.log('코스 아이템 확인: ', courseItem);

        if (!courseItem.places) {
          console.error(`ERROR: Course No ${courseItem.courseNo}에 선택된 장소 정보가 없습니다.`);
          return null;
        }

        const { placeAddr, placeName, lat, lng, placeId, placeUrl } = courseItem.places;

        // 🚨 서버 DTO 구조에 맞춰 party_id를 포함하고, 좌표는 숫자로 변환합니다.
        return {
          // party_id: partyId, // DTO에 party_id가 있으므로 포함
          course_id: placeId,
          course_no: courseItem.courseNo,
          place_name: placeName,
          place_address: placeAddr,
          course_view: true, // boolean 값 전송
          place_lat: Number(lat), // ✅ 문자열 -> 숫자로 변환
          place_lng: Number(lng), // ✅ 문자열 -> 숫자로 변환
          place_url: placeUrl,
        };
      });
    } else {
      // 1. 전송할 데이터 구조로 변환 (Mapping)
      payloadCourses = courses.map((courseItem) => {
        // console.log(courseItem)
        if (!courseItem.places) {
          console.error(`ERROR: Course No ${courseItem.courseNo}에 선택된 장소 정보가 없습니다.`);
          return null;
        }

        const { placeAddr, placeName, lat, lng } = courseItem.places;

        // 🚨 서버 DTO 구조에 맞춰 party_id를 포함하고, 좌표는 숫자로 변환합니다.
        return {
          // party_id: partyId, // DTO에 party_id가 있으므로 포함
          course_id: courseItem.courseId,
          course_no: courseItem.courseNo,
          place_name: placeName,
          place_address: placeAddr,
          course_view: true, // boolean 값 전송
          place_lat: Number(lat), // ✅ 문자열 -> 숫자로 변환
          place_lng: Number(lng), // ✅ 문자열 -> 숫자로 변환
          place_url: courseItem.places.placeUrl,
        };
      });
    }

    // API 요청 본문 (DTO가 courses 배열을 감싸는 객체를 요구한다고 가정)
    requestBody = {
      courses: payloadCourses,
    };

    // console.log('최종 전송 데이터:', requestBody);

    // 2. 서버 전송 로직 구현
    try {
      setIsLoading(true);
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.patch(`${baseURL}/party/${partyId}/courseArray`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('데이터 전송 성공: ', response);
      if (response.status === 200) {
        navigate(`/midpoint/success/${partyId}`);
      }
    } catch (error) {
      // 🚨 서버에서 반환한 구체적인 400 에러 메시지를 확인합니다.
      // console.error('코스 저장 API 오류:', error);
      alert('결과를 저장하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [courses, navigate, partyId, token]);

  // 7. useEffect: 데이터 로드 완료 및 courseIndex/mode 변경 감지 후 추천 리스트 로드
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    getPartyAndCourse();
  }, []);

  // 로딩 중이거나 필수 데이터(midCourseMode)가 아직 로드되지 않았다면 로딩 컴포넌트를 표시
  if (midCourseMode === null) {
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
      <LoadingOverlay isOverlay={true} isActive={isLoading} />
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
