import React, { useEffect, useMemo, useState } from 'react';
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
  resultData: MidFindData | MidResultData | null; // 입력 데이터
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
  // 🚨 [수정]: mapPoints 상태 제거. useMemo로 대체
  // const [mapPoints, setMapPoints] = useState<Point[]>([]); 

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
  const initialDateString = partyDate; 
  const dateObject = new Date(initialDateString);
  const isDateValid = !isNaN(dateObject.getTime());
  const formattedDateString = isDateValid ? format(dateObject, 'yyyy.MM.dd aa h시', { locale: ko }) : '날짜 미정'; 
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

  // 💡 [수정]: useMemo를 사용하여 mapPoints 계산. 상태 업데이트 제거.
  const mapPoints = useMemo(() => {
    // findData, finalData가 null이면 빈 배열 반환
    if (!findData && !finalData) return [];

    const extractPoints = () => {
      const dataToProcess = findData || finalData;
      if (!dataToProcess || !dataToProcess.party) return [];

      const { party } = dataToProcess;
      const newPoints: Point[] = [];
      const uniquePoints = new Set<string>();

      // -------------------------------------------------------------
      // 헬퍼 함수: 중복 체크 후 포인트 추가. (순서 정보 없는 포인트 우선)
      // -------------------------------------------------------------
      const addPoint = (point: Point) => {
        const key = `${point.lat},${point.lng}`;

        if (point.type === 'midpoint') {
          newPoints.push(point);
          return;
        }

        // ⭐ 'selected' 타입일 때, 중복 체크 및 추가
        if (!uniquePoints.has(key)) {
          newPoints.push(point);
          uniquePoints.add(key);
        }
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

      // 🎯 4. AI 모드 임시 추천 목록 장소 추가는 현재 주석 처리되어 있으므로 무시합니다.

      return newPoints;
    };

    return extractPoints();
  }, [findData, finalData, courses]); // findData, finalData, courses가 변경될 때만 mapPoints 재계산

  // 🚨 [제거]: 불필요한 useEffect 블록은 제거되었습니다.

  // *******************************************************************
  // 3. 렌더링 콘텐츠 로직
  // *******************************************************************

  const renderContent = () => {
    if (isFindMode && findData) {
      if (midCourseMode === 'AI_COURSE' && findData.aiRecommendList) {
        // AI_COURSE 모드에서는 AIRecommendPlace[] 배열을 순회
        console.log('AI 코스 렌더링 모드 진입', courses);
        // AI 코스에서 courses[0].places?.placeName이 ''인 경우, 선택되지 않은 것으로 간주
        const isCoursesSelected = courses.length > 0 && courses[0].places?.placeName !== ''; 
        return (
          <>
            <div className='mb-6'>
              <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>코스를 골라주세요!</div>
              <div className='flex flex-nowrap overflow-x-auto space-x-4 '>
                {findData.aiRecommendList.map((aiCourse, index) => (
                  <MidPlaceItemAI
                    key={aiCourse.courseId}
                    data={aiCourse}
                    index={index} 
                    onClickDetail={() => onPlaceAISelect?.(index)}
                  />
                ))}
              </div>
            </div>

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
          {/* 💡 [수정]: key props 제거 (불필요한 Map 컴포넌트 재마운트 방지) */}
          <Map points={mapPoints} /> 
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