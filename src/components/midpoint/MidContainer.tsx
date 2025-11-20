import React, { useEffect, useState } from 'react';
import MidPlaceItem from './MidPlaceItem';
import MidPlaceDetail from './MidPlaceDetail';
import Button from '../common/Button';
import CourseRouteViewer from './CourseRouteViewer';
// 필요한 외부 타입은 모두 import 되었다고 가정합니다.
import type { RecommendedPlace, MidFindData } from '../../types/MidFindTypes';
import type { MidResultData } from '../../types/MidResultTypes'; // FinalPartyResult, MemberRouteInfo 추가 가정
import type { ViewMode, PartyData, PartyCourse, Point } from '../../types/MidCommonTypes'; // PartyData, ViewMode 추가 가정
import MemberRouteDetail from './MemberRouteDetail';
import MidPlaceItemAI from './MidPlaceItemAI';
import Map from './Map';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일
import axios from 'axios';
import { useParams } from 'react-router-dom';

// *******************************************************************
// MidFindData와 MidResultData의 구조적 차이 사용
// MidResultData는 'members' 속성을 필수로 가지고 있다는 전제
// *******************************************************************
const isMidResultData = (data: MidFindData | MidResultData): data is MidResultData => {
  return 'members' in data;
};

const getTokenFromStorage = () => localStorage.getItem('token') || null;

interface MidContainerProps {
  mode: ViewMode;
  resultData: MidFindData | MidResultData; // 입력 데이터
  handleNext?: () => void;
  handlePrev?: () => void;
  handleSave?: () => void;
  onPlaceSelect?: (place: RecommendedPlace) => void;
  onPlaceAISelect?: (index: number) => void;
}

const MidContainer: React.FC<MidContainerProps> = ({ mode, resultData, handleNext, handlePrev, handleSave, onPlaceSelect, onPlaceAISelect }) => {
  const { partyId } = useParams();
  const token = getTokenFromStorage();

  const isFindMode = mode === 'FIND';
  const isViewMode = mode === 'VIEW';
  const isResultData = isMidResultData(resultData); // 데이터 타입을 판별
  const [mapPoints, setMapPoints] = useState<Point[]>([]); // 지도 관련

  // 받은 데이터 할당
  const finalData: MidResultData | null = isViewMode && isResultData ? (resultData as MidResultData) : null;
  const findData: MidFindData | null = isFindMode && !isResultData ? (resultData as MidFindData) : null;

  // 공통 데이터 추출 (data.party 속성 사용)
  const partyInfo: PartyData | null = isFindMode ? findData?.party || null : finalData?.party || null;
  const partyName = partyInfo?.partyName || '모임명 미정';
  const midPoint = partyInfo?.midPoint || '중간 지점 미정';
  const partyDate = partyInfo?.partyDate || '날짜 미정';
  const courses: PartyCourse[] = partyInfo?.courses || [];

  // 날짜 포매팅
  const initialDateString = partyDate; // 예: '2025-10-22T12:00:00.000Z' 또는 '2025.12.25 오후 7시'
  const dateObject = new Date(initialDateString);
  const isDateValid = !isNaN(dateObject.getTime());
  const formattedDateString = isDateValid ? format(dateObject, 'yyyy.MM.dd aa h시', { locale: ko }) : '날짜 미정'; // 파싱에 실패하거나 '날짜 미정'이면 '날짜 미정' 출력
  const dateToDisplay = formattedDateString;

  // 코스 수 및 인덱스 계산
  const totalCourses = courses.length;
  // FIND 모드에서만 currentCourseIndex가 필요
  const currentCourseIndex = findData?.currentCourseIndex || 0;
  const isCurrentUserLeader = finalData?.isLeader;

  // AI 모드일 때 현재 코스에 해당하는 장소 목록을 미리 추출
  let aiPlacesToRender: RecommendedPlace[] | null = null;
  const midCourseMode = findData?.courseMode; // findData에서 courseMode 가져오기

  if (isFindMode && findData && midCourseMode === 'AI_COURSE' && findData.aiRecommendList) {
    const targetCourseNo = currentCourseIndex + 1;
    const currentAICourse = findData.aiRecommendList.find((aiCourse) => aiCourse.courseNo === targetCourseNo);
    aiPlacesToRender = currentAICourse?.places || null;
  }

  // useEffect(() => {
  //   // ⚠️ 1. findData가 null이 아닐 때만 실행
  //   if (!findData && !finalData) return;

  //   // 2. MapData 추출 로직
  //   const extractPoints = () => {
  //     const dataToProcess = findData || finalData;
  //     if (!dataToProcess || !dataToProcess.party) return [];

  //     const { party } = dataToProcess;
  //     const newPoints: Point[] = [];

  //     // ⭐ 이미 추가된 포인트를 추적하기 위한 Set (좌표 문자열 사용)
  //     const uniquePoints = new Set<string>();

  //     // 포인트를 배열에 추가하는 헬퍼 함수
  //     const addPoint = (point: Point) => {
  //       const key = `${point.lat},${point.lng}`;

  //       // 중간 지점은 이름이 고정이므로 무조건 추가
  //       if (point.type === 'midpoint') {
  //         newPoints.push(point);
  //         return;
  //       }

  //       // 선택된 장소(selected)일 경우 중복 체크
  //       if (!uniquePoints.has(key)) {
  //         newPoints.push(point);
  //         uniquePoints.add(key);
  //       }
  //     };

  //     // 🎯 1. 중간 지점 좌표 추가
  //     if (party.midPointLat && party.midPointLng) {
  //       addPoint({
  //         lat: party.midPointLat,
  //         lng: party.midPointLng,
  //         name: '계산된 중간 지점',
  //         type: 'midpoint',
  //       });
  //     }

  //     // 🎯 2. (CUSTOM 모드) 사용자가 선택한 장소 데이터 추가
  //     if (findData && findData.placeData && findData.placeData.lat && findData.placeData.lng) {
  //       addPoint({
  //         lat: findData.placeData.lat,
  //         lng: findData.placeData.lng,
  //         name: findData.placeData.placeName,
  //         type: 'selected',
  //       });
  //     }

  //     // 🎯 3. (AI/VIEW 모드) 현재 선택된 코스 장소들 추가
  //     const placesInCourse = courses.flatMap((c) => (c.places ? [c.places] : []));
  //     placesInCourse.forEach((p) => {
  //       if (p.lat && p.lng) {
  //         addPoint({
  //           lat: p.lat,
  //           lng: p.lng,
  //           name: p.placeName,
  //           type: 'selected',
  //         });
  //       }
  //     });

  //     // ⭐ 수정: map을 사용하여 배열의 순서(index)를 얻습니다.
  //     courses.forEach((course, index) => {
  //       const p = course.places; // places는 RecommendedPlace 타입일 것입니다.

  //       if (p?.lat && p.lng) {
  //         // nullish/undefined 체크
  //         const coursePoint: Point = {
  //           lat: p.lat,
  //           lng: p.lng,
  //           name: p.placeName,
  //           type: 'selected',
  //           index: index + 1, // ⭐⭐⭐ 현재 배열 순서(0부터 시작)에 +1을 하여 1부터 시작하는 순서 번호를 부여합니다.
  //         };
  //         console.log('코스 인덱스 부여중', coursePoint);

  //         addPoint(coursePoint);
  //       }
  //     });

  //     console.log('맵 포인트 (최종): ', newPoints);

  //     return newPoints;
  //   };

  //   const extractedPoints = extractPoints();
  //   setMapPoints(extractedPoints);

  //   // ⚠️ 3. 의존성 배열 수정: findData, finalData, courses가 변경될 때마다 재실행
  // }, [findData, finalData, courses]); // courses도 상태 변경 시 재실행되도록 포함

  useEffect(() => {
    if (!findData && !finalData) return;

    const extractPoints = () => {
      const dataToProcess = findData || finalData;
      if (!dataToProcess || !dataToProcess.party) return [];

      const { party } = dataToProcess;
      const newPoints: Point[] = [];
      const uniquePoints = new Set<string>();

      // -------------------------------------------------------------
      // 헬퍼 함수: 중복 체크 후 포인트 추가.
      // 이 함수는 'midpoint'와 'selected' 타입만 처리합니다.
      // 'selected' 타입은 key를 체크하여 중복을 방지합니다.
      // -------------------------------------------------------------
      const addPoint = (point: Point) => {
        const key = `${point.lat},${point.lng}`;

        if (point.type === 'midpoint') {
          newPoints.push(point);
          // 중간 지점은 uniquePoints에 추가하지 않습니다.
          return;
        }

        // ⭐ 'selected' 타입일 때, 중복 체크 및 추가
        if (!uniquePoints.has(key)) {
          newPoints.push(point);
          uniquePoints.add(key);
        }
        // 🚨 만약 중복이 발생하면, 이미 추가된 (index가 없을 가능성이 높은) 장소가 남고,
        //    이후에 들어오는 (index가 있는) 장소는 무시됩니다.
        //    따라서 로직의 실행 순서가 매우 중요합니다!
      };

      // -------------------------------------------------------------
      // 🎯 1. 중간 지점 좌표 추가 (항상 최우선)
      // -------------------------------------------------------------
      if (party.midPointLat && party.midPointLng) {
        addPoint({
          lat: party.midPointLat,
          lng: party.midPointLng,
          name: '계산된 중간 지점',
          type: 'midpoint',
        });
      }

      // -------------------------------------------------------------
      // 🎯 2. 코스 장소들 추가 (순서 정보가 있으므로 우선 처리)
      // -------------------------------------------------------------
      // 코스 배열을 순회하며 index를 부여하고, 이를 먼저 newPoints에 추가하여 우선권을 줍니다.
      courses.forEach((course, index) => {
        const p = course.places;

        if (p?.lat && p.lng) {
          const key = `${p.lat},${p.lng}`;

          // ⭐ 중복 체크: 이미 다른 코스 장소가 추가되지 않았을 때만 추가
          if (!uniquePoints.has(key)) {
            newPoints.push({
              lat: p.lat,
              lng: p.lng,
              name: p.placeName,
              type: 'selected',
              index: index + 1, // ⭐ 코스 순서 부여
            });
            uniquePoints.add(key);
          }
        }
      });

      // -------------------------------------------------------------
      // 🎯 3. CUSTOM 모드 임시 선택 장소 추가 (순서 정보 없음, 코스에 없을 때만)
      // -------------------------------------------------------------
      const midCourseMode = findData?.courseMode;

      // CUSTOM 모드이고, placeData가 있으며, 좌표가 유효한 경우
      if (midCourseMode === 'CUSTOM_COURSE' && findData && findData.placeData && findData.placeData.lat && findData.placeData.lng) {
        const p = findData.placeData;
        const key = `${p.lat},${p.lng}`;

        // ⭐⭐ 중복 체크: 이미 코스 장소로 추가되지 않았을 때만 추가
        if (!uniquePoints.has(key)) {
          // index가 없는 임시 장소
          newPoints.push({
            lat: p.lat,
            lng: p.lng,
            name: p.placeName,
            type: 'selected',
            // index 필드 생략 (순서 없음)
          });
          uniquePoints.add(key);
        }
      }

      // -------------------------------------------------------------
      // 🎯 4. AI 모드 임시 추천 목록 장소 추가 (AI 모드에서 코스 리스트를 보여줄 때 필요하다면)
      // -------------------------------------------------------------
      /*
        // 현재 로직에서 🎯 3번 코스 목록이 AI/VIEW 모드의 확정 코스를 커버하고 있으므로, 
        // AI 모드에서 임시로 보여주는 추천 목록 장소(aiPlacesToRender)를 지도에 표시해야 한다면
        // 이 부분을 추가해야 합니다.
        if (midCourseMode === 'AI_COURSE' && aiPlacesToRender) {
             aiPlacesToRender.forEach(p => {
                 const key = `${p.lat},${p.lng}`;
                 if (p.lat && p.lng && !uniquePoints.has(key)) {
                    // index가 없는 AI 추천 장소
                    newPoints.push({ lat: p.lat, lng: p.lng, name: p.placeName, type: 'selected' });
                    uniquePoints.add(key);
                 }
             });
        }
        */

      return newPoints;
    };

    const extractedPoints = extractPoints();

    const getPartyAndCourse = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/party/${partyId}/mid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('데이터 세팅: ', response);
      } catch (error) {
        console.log(error);
      }
    };
    getPartyAndCourse();
    setMapPoints(extractedPoints);
  }, [findData, finalData, courses]);

  // *******************************************************************
  // 3. 렌더링 콘텐츠 로직
  // *******************************************************************

  const renderContent = () => {
    if (isFindMode && findData) {
      if (midCourseMode === 'AI_COURSE' && findData.aiRecommendList) {
        // AI_COURSE 모드에서는 AIRecommendPlace[] 배열을 순회
        const isCoursesSelected = courses.length > 0 && courses[0].places?.placeName !== '미정';
        return (
          <>
            <div className='mb-6'>
              <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>코스를 골라주세요!</div>
              <div className='flex flex-nowrap overflow-x-auto space-x-4 '>
                {findData.aiRecommendList.map((aiCourse, index) => (
                  <MidPlaceItemAI
                    key={aiCourse.courseId}
                    data={aiCourse}
                    index={index} // onCourseSelect 핸들러 구현 필요 (해당 코스 목록을 로드하는 함수)
                    onClickDetail={() => onPlaceAISelect?.(index)}
                  />
                ))}
              </div>
            </div>

            {/* 현재 AI 코스의 상세 장소 목록만 표시 */}
            {/* {aiPlacesToRender &&
              // 🎯 [수정] 불필요한 중괄호 {}를 제거했습니다.
              aiPlacesToRender.map((placeDetail, index) => (
                <MidPlaceDetail
                  key={placeDetail.placeId || index} // key는 필수로 추가해주는 것이 좋습니다.
                  place={placeDetail}
                  mode={midCourseMode}
                />
              ))} */}
            {isCoursesSelected &&
              courses.map((course, index) => {
                return <MidPlaceDetail place={course.places} mode={midCourseMode} key={index} index={index} />;
              })}
          </>
        );
      } else if (midCourseMode === 'CUSTOM_COURSE' && findData.customRecommendList) {
        // CUSTOM_COURSE 모드에서는 RecommendedPlace[] 배열을 순회 (기존 로직)
        return (
          <>
            <div className='mb-6'>
              <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>장소를 골라주세요!</div>
              <div className='flex flex-nowrap overflow-x-auto space-x-4 items-stretch min-h-[250px]'>
                {findData.customRecommendList.map((place, index) => (
                  <MidPlaceItem
                    key={place.placeId}
                    index={index}
                    data={place} // RecommendedPlace 타입 전달
                    onClickDetail={onPlaceSelect}
                    mode={mode}
                  />
                ))}
              </div>
            </div>

            {findData.placeData && <MidPlaceDetail place={findData.placeData} mode={midCourseMode} />}
          </>
        );
      }
    } else if (isViewMode && finalData) {
      // VIEW 모드: 확정된 코스 및 모임원별 경로 표시
      return (
        <>
          <div className='mb-6'>
            <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>코스가 확정되었습니다!</div>
            <div className='flex flex-nowrap overflow-x-auto space-x-4 items-stretch'>
              {/* MidResultData의 courses 배열 사용 */}
              {courses &&
                courses.map((place, index) => {
                  const placeData = place.places;
                  return <MidPlaceItem key={place.courseNo} index={index} data={placeData} onClickDetail={onPlaceSelect} mode={mode} />;
                })}
            </div>
          </div>

          <div className='mb-6'>
            <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>모임원별 가는 방법</div>
            {finalData.members.map((member, index) => {
              // 방장 판단 로직: member.name에 '(나)'가 포함되어 있고 현재 유저가 방장일 때 => 추후에 아이디로 비교해야 함
              const isThisMemberTheLeader = isCurrentUserLeader && member.name.includes('(나)');
              return <MemberRouteDetail key={member.name} member={member} isLeader={!!isThisMemberTheLeader} />;
            })}
          </div>
        </>
      );
    }
    return null;
  };

  // *******************************************************************
  // 4. 렌더링 버튼 로직 (기존 로직 유지)
  // *******************************************************************
  const renderButtons = () => {
    // ... (기존 로직 유지)
    if (isFindMode && findData) {
      if (findData.courseMode === 'AI_COURSE') {
        return (
          <>
            <div className='flex justify-end'>
              <Button buttonName='저장' className='bg-gray-900' onClick={handleSave} />
            </div>
          </>
        );
      } else {
        const isFirst = findData.currentCourseIndex === 0;
        const isLast = findData.currentCourseIndex === totalCourses - 1;
        // console.log(isFirst, isLast);
        return (
          <>
            <div className='flex justify-end'>
              {!isFirst && <Button buttonName='이전' className='mr-3 bg-gray-900' onClick={handlePrev} />}
              {!isLast && <Button buttonName='다음' onClick={handleNext} className='mr-3 ' />}
              <Button buttonName='저장' className='bg-gray-900' onClick={handleSave} />
            </div>
          </>
        );
      }
    } else {
      return (
        <>
          <div className='flex justify-end'>
            <Button buttonName='결과 공유' className='bg-mint-500' onClick={() => console.log('공유하기')} />
          </div>
        </>
      );
    }
  };

  // *******************************************************************
  // 5. 최종 렌더링
  // *******************************************************************
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='text-left mb-2 text-lg font-medium text-gray-700'>모임명: {partyName}</div>
      <div className='flex flex-col md:flex-row items-start md:items-end mb-8 text-left'>
        <div className='text-3xl font-semibold text-mint-500 mr-4'>중간지점: {midPoint}</div>
        <div className='text-lg font-medium text-gray-700 mt-2 md:mt-0'>날짜: {dateToDisplay}</div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm'>
          <Map points={mapPoints} key={mapPoints.length} />
        </div>

        <div className='col-span-1 p-4 bg-white border border-gray-200 rounded-lg shadow-sm'>
          <CourseRouteViewer courses={courses} currentIndex={currentCourseIndex} />
        </div>
      </div>

      {/* 콘텐츠 영역 분기 */}
      {renderContent()}

      <div className='mt-8'>{renderButtons()}</div>
    </div>
  );
};

export default MidContainer;
