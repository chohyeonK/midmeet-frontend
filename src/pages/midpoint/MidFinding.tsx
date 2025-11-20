// import React, { useCallback, useEffect, useState } from 'react';
// import MidContainer from '../../components/midpoint/MidContainer';
// import Loading from '../../components/common/Loading';
// import { useNavigate, useParams } from 'react-router-dom';
// import type { PartyData, PartyCourse } from '../../types/MidCommonTypes'; // PartyCourse 추가
// import type { AIRecommendPlace, MidFindData, RecommendedPlace } from '../../types/MidFindTypes';
// import { MOCK_FOOD_LIST, MOCK_CAFE_LIST, MOCK_SHOPPING_LIST, MOCK_MID_FIND_INITIAL_DATA, MOCK_AI_RECOMMEND_LIST } from '../../data/mockRecommend';
// import axios from 'axios';

// const getTokenFromStorage = () => localStorage.getItem('token') || null;

// const MidFinding: React.FC = () => {
//   const { partyId } = useParams();
//   const token = getTokenFromStorage();

//   const navigate = useNavigate();
//   // 초기 기본 모임 데이터 세팅
//   const initParty = MOCK_MID_FIND_INITIAL_DATA;
//   const midMode = 'FIND';
//   // const midCourseMode = initParty.courseMode;
//   const [midCourseMode, setMidCourseMode] = initParty.courseMode;

//   const partyInfo = {
//     partyName: initParty.party.partyName,
//     partyDate: initParty.party.partyDate,
//     midPoint: initParty.party.midPoint,
//     midPointLat: initParty.party.midPointLat,
//     midPointLng: initParty.party.midPointLng,
//   };

//   const [courses, setCourses] = useState<PartyCourse[]>(initParty.party.courses);
//   const [currentCourseIndex, setCurrentCourseIndex] = useState(initParty.currentCourseIndex);
//   const [recommendList, setRecommendList] = useState<RecommendedPlace[] | null>(null);
//   const [aiRecommendList, setAiRecommendList] = useState<AIRecommendPlace[] | null>(null);
//   const [placeData, setPlaceData] = useState<RecommendedPlace | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const totalCourses = courses.length;
//   const isFirst = currentCourseIndex === 0;
//   const isLast = currentCourseIndex === totalCourses - 1;

//   // 2. 추천 리스트 로드 로직 (currentCourseIndex가 바뀔 때 실행, ai/custom 분기 처리)
//   const loadRecommendList = useCallback(() => {
//     let newRecommend: RecommendedPlace[] = []; // CUSTOM 모드용
//     let newAIRecommend: AIRecommendPlace[] = [];

//     if (midCourseMode === 'AI_COURSE') {
//       // ... (AI 모드 로직 주석 유지 또는 구현) ...
//       newAIRecommend = MOCK_AI_RECOMMEND_LIST;
//     }

//     // ✅ 2. CUSTOM 모드일 때: 인덱스별 리스트를 설정
//     switch (currentCourseIndex) {
//       case 0:
//         newRecommend = MOCK_FOOD_LIST;
//         break;
//       case 1:
//         newRecommend = MOCK_CAFE_LIST;
//         break;
//       case 2:
//         newRecommend = MOCK_SHOPPING_LIST;
//         break;
//       default:
//         newRecommend = [];
//         break;
//     }

//     setRecommendList(newRecommend);
//     setAiRecommendList(newAIRecommend);

//     // 🎯 현재 코스에 이미 선택된 장소 데이터가 있는지 확인합니다.
//     // const selectedPlace = courses[currentCourseIndex]?.places;

//     // 💡 [수정] 이미 선택된 장소가 없다면, 새 리스트의 첫 번째 장소를 상세 정보로 설정
//     // placeName이 '미정'이거나 placeId가 초기값(900 등)인 경우를 '미선택'으로 간주
//     // if (selectedPlace && selectedPlace.placeName !== '미정' && selectedPlace.placeId !== 900) {
//     //   setPlaceData(selectedPlace);
//     // } else {
//     //   setPlaceData(newRecommend[0] || null);
//     // }
//   }, [currentCourseIndex, courses, midCourseMode]); // midCourseMode 의존성 추가

//   // 받은 데이터 프론트가 원하는 형식으로 변환하는 함수
//     const convertDataFront = (data) => {
//       console.log('받은 데이터: ', data);
//       const { party, midpoint, course_list } = data;
//       const { party_name, date_time, party_type } = party;
//       const { name, lat, lng } = midpoint;

//       const findDataFront: MidFindData = {
//         party: {
//           partyName: party_name,
//           partyDate: date_time,
//           midPoint: name,
//           midPointLat: lat,
//           midPointLng: lng,
//           courses: course_list,
//         },
//         courseMode: party_type,
//         customRecommendList: null,
//         aiRecommendList: null,
//         currentCourseIndex: 0,
//         placeData: null,
//       };
//       setMidCourseMode(party_type);
//       console.log('변환한 데이터: ', findDataFront);
//     };

//     const getPartyAndCourse = async () => {
//       try {
//         const baseURL = import.meta.env.VITE_API_URL;
//         const response = await axios.get(`${baseURL}/party/${partyId}/mid`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log('데이터 세팅: ', response);
//         convertDataFront(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//   // 3. '이전/다음' 버튼 핸들러 (useCallback 사용)
//   const handlePrev = useCallback(() => {
//     if (!isFirst) {
//       setCurrentCourseIndex((prev) => prev - 1);
//       setPlaceData(null);
//     }
//   }, [isFirst]);

//   const handleNext = useCallback(() => {
//     if (!isLast) {
//       setCurrentCourseIndex((next) => next + 1);
//       setPlaceData(null);
//     }
//   }, [isLast]);

//   // 4. 장소 선택/상세 보기 핸들러 (useCallback 사용)
//   const onPlaceSelect = useCallback(
//     (place: RecommendedPlace): void => {
//       // console.log('장소 선택 클릭', place);
//       setPlaceData(place);

//       // ✅ [수정] 선택된 장소의 모든 정보를 코스 리스트(state)에 반영
//       setCourses((prevCourses) => {
//         const updatedCourses = [...prevCourses];
//         updatedCourses[currentCourseIndex] = {
//           ...prevCourses[currentCourseIndex], // 기존 courseNo 복사

//           // 🎯 places 속성 전체를 선택된 장소 (place)의 모든 정보로 교체
//           places: place,
//         };
//         return updatedCourses;
//       });
//     },
//     [currentCourseIndex], // courses 의존성은 제거하여 불필요한 loadRecommendList 재실행 방지
//   );

//   // ai 코스 선택
//   const onCourseIndexSelect = useCallback(
//     (selectedIndex: number) => {
//       // 1. 선택된 AI 코스 객체의 places 배열 (RecommendedPlace[])을 가져옵니다.
//       const selectedPlacesArray = aiRecommendList?.[selectedIndex]?.places;

//       if (!selectedPlacesArray || selectedPlacesArray.length === 0) {
//         console.warn(`선택된 인덱스 ${selectedIndex}에 대한 장소 목록이 비어 있습니다.`);
//         return;
//       }

//       const newCourses: PartyCourse[] = selectedPlacesArray.map((place, index) => {
//         return {
//           courseNo: index + 1,
//           places: place,
//         } as PartyCourse;
//       });

//       setCourses(newCourses);

//       // 4. 인덱스를 첫 번째 코스로 초기화
//       setCurrentCourseIndex(0);
//     },
//     [aiRecommendList, setCourses, setCurrentCourseIndex, setPlaceData],
//   );

//   // 5. 최종 데이터 제출 핸들러 (저장 버튼)
//   const sumbitData = useCallback(() => {
//     console.log('최종 저장 버튼 클릭', { ...partyInfo, courses: courses });
//     // 서버 전송 로직 구현
//     navigate('/midpoint/success');
//   }, [courses, navigate, partyInfo]);

//   // 6. useEffect: 초기 로딩 및 currentCourseIndex 변경 감지
//   useEffect(() => {
//     const loadingTimer = setTimeout(() => {
//       setIsLoading(false);
//       getPartyAndCourse();
//       loadRecommendList();
//       // console.log('✅ useEffect에서 확인한 최종 변경된 코스:', courses);
//     }, 1000);
//     return () => clearTimeout(loadingTimer);
//   }, [loadRecommendList]);

//   if (isLoading) {
//     return <Loading title='최적의 만남 장소를 분석하고 있습니다.' message='잠시만 기다려주세요!' />;
//   }

//   // MidContainer로 전달할 최종 Props 구성
//   const midContainerProps: MidFindData = {
//     party: {
//       ...partyInfo,
//       courses: courses,
//     } as PartyData,
//     courseMode: midCourseMode,
//     customRecommendList: recommendList,
//     aiRecommendList: aiRecommendList,
//     currentCourseIndex: currentCourseIndex,
//     placeData: placeData,
//   };

//   return (
//     <>
//       <MidContainer
//         mode={midMode}
//         resultData={midContainerProps}
//         handlePrev={handlePrev}
//         handleNext={handleNext}
//         handleSave={sumbitData}
//         onPlaceSelect={onPlaceSelect}
//         onPlaceAISelect={onCourseIndexSelect}
//       />
//     </>
//   );
// };

// export default MidFinding;

import React, { useCallback, useEffect, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import Loading from '../../components/common/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import type { PartyData, PartyCourse } from '../../types/MidCommonTypes';
import type { AIRecommendPlace, MidFindData, RecommendedPlace } from '../../types/MidFindTypes';
import { MOCK_FOOD_LIST, MOCK_CAFE_LIST, MOCK_SHOPPING_LIST, MOCK_AI_RECOMMEND_LIST } from '../../data/mockRecommend';
import axios from 'axios';

const getTokenFromStorage = () => localStorage.getItem('token') || null;

// 초기 partyInfo 구조를 위한 타입 정의 (PartyData에서 courses를 제외한 부분)
const initialPartyInfo = {
  partyName: '',
  partyDate: '',
  midPoint: '',
  midPointLat: 0,
  midPointLng: 0,
};

type CourseMode = 'AI_COURSE' | 'CUSTOM_COURSE';

const MidFinding: React.FC = () => {
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

  // 2. 추천 리스트 로드 로직 (currentCourseIndex가 바뀔 때 실행, ai/custom 분기 처리)
  const loadRecommendList = useCallback(() => {
    let newRecommend: RecommendedPlace[] = [];
    let newAIRecommend: AIRecommendPlace[] = [];

    // midCourseMode가 설정되지 않았다면 리턴
    if (!midCourseMode) return;

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

    // 🎯 이미 선택된 장소가 없다면, 새 리스트의 첫 번째 장소를 상세 정보로 설정 (원래 로직 유지)
    // 이 로직이 courses에 의존하지 않도록 수정해야 재귀 호출을 막을 수 있습니다.
    // 현재 courses를 직접 참조하는 로직은 주석 처리되어 있으므로, dependencies에서 courses만 제거합니다.
  }, [currentCourseIndex, midCourseMode]); // courses 의존성 제거: 장소 선택 시 불필요한 재실행 방지

  // 받은 데이터 프론트가 원하는 형식으로 변환하는 함수
  const convertDataFront = (data: any) => {
    // data 타입은 백엔드 응답 구조에 맞게 수정 필요
    console.log('받은 데이터: ', data);
    const { party, midpoint, course_list } = data;
    const { party_name, date_time, party_type } = party;
    const { name, lat, lng } = midpoint;

    // 1. midCourseMode 상태 업데이트
    setMidCourseMode(party_type);

    // 2. partyInfo 상태 업데이트
    const newPartyInfo = {
      partyName: party_name,
      partyDate: date_time,
      midPoint: name,
      midPointLat: lat,
      midPointLng: lng,
    };
    setPartyInfo(newPartyInfo);

    // 3. courses 상태 업데이트
    setCourses(course_list);

    // 4. 로딩 상태 해제
    setIsLoading(false);

    console.log('변환 후 설정된 partyInfo: ', newPartyInfo);
  };

  const getPartyAndCourse = async () => {
    setIsLoading(true); // API 호출 시작 시 로딩 상태 설정
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${baseURL}/party/${partyId}/mid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('데이터 세팅: ', response);
      convertDataFront(response.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false); // 에러 발생 시 로딩 해제
    }
  };

  // 3. '이전/다음' 버튼 핸들러 (useCallback 사용) - 변경 없음
  const handlePrev = useCallback(() => {
    if (!isFirst) {
      setCurrentCourseIndex((prev) => prev - 1);
      setPlaceData(null);
    }
  }, [isFirst]);

  const handleNext = useCallback(() => {
    if (!isLast) {
      setCurrentCourseIndex((next) => next + 1);
      setPlaceData(null);
    }
  }, [isLast]);

  // 4. 장소 선택/상세 보기 핸들러 (useCallback 사용) - 변경 없음
  const onPlaceSelect = useCallback(
    (place: RecommendedPlace): void => {
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
          courseNo: index + 1,
          places: place,
        } as PartyCourse;
      });

      setCourses(newCourses);

      setCurrentCourseIndex(0);
      setPlaceData(newCourses[0].places); // 첫 코스의 첫 장소를 상세 정보로 설정
    },
    [aiRecommendList], // setCourses, setCurrentCourseIndex, setPlaceData 의존성은 간결화를 위해 제거 가능
  );

  // 5. 최종 데이터 제출 핸들러 (저장 버튼) - 변경 없음
  const sumbitData = useCallback(() => {
    console.log('최종 저장 버튼 클릭', { ...partyInfo, courses: courses });
    // 서버 전송 로직 구현
    navigate('/midpoint/success');
  }, [courses, navigate, partyInfo]);

  // 6. useEffect: 초기 데이터 로딩 (컴포넌트 마운트 시 1회 실행)
  useEffect(() => {
    getPartyAndCourse();
  }, []);

  // 7. useEffect: 데이터 로드 완료 및 courseIndex/mode 변경 감지 후 추천 리스트 로드
  useEffect(() => {
    // isLoading이 false이고, midCourseMode가 설정되었을 때만 추천 리스트 로드
    if (!isLoading && midCourseMode !== null) {
      loadRecommendList();
    }
  }, [loadRecommendList, isLoading, midCourseMode]);

  // 로딩 중이거나 필수 데이터(midCourseMode)가 아직 로드되지 않았다면 로딩 컴포넌트를 표시
  if (isLoading || midCourseMode === null) {
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
