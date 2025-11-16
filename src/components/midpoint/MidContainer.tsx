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

// *******************************************************************
// 🚨 (가정) Type Guard 함수 정의
// MidFindData와 MidResultData의 구조적 차이를 이용합니다.
// MidResultData는 'members' 속성을 필수로 가지고 있다고 가정합니다.
// *******************************************************************
const isMidResultData = (data: MidFindData | MidResultData): data is MidResultData => {
  return 'members' in data;
};

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
  const isFindMode = mode === 'FIND';
  const isViewMode = mode === 'VIEW';
  const isResultData = isMidResultData(resultData); // 데이터 타입을 판별
  const [mapPoints, setMapPoints] = useState<Point[]>([]); // 지도 관련

  // ✅ 1. 분기된 데이터 할당 (타입 가드를 이용해 정확하게 형변환)
  // MidResultData는 FinalPartyResult와 구조가 유사하다고 가정하고 resultData를 사용합니다.
  const finalData: MidResultData | null = isViewMode && isResultData ? (resultData as MidResultData) : null;
  const findData: MidFindData | null = isFindMode && !isResultData ? (resultData as MidFindData) : null;

  // ✅ 2. 공통 데이터 추출 (data.party 속성 사용)
  const partyInfo: PartyData | null = isFindMode ? findData?.party || null : finalData?.party || null;

  const partyName = partyInfo?.partyName || '모임명 미정';
  const midPoint = partyInfo?.midPoint || '중간 지점 미정'; // MidResultData에도 midPoint가 있다고 가정
  const partyDate = partyInfo?.partyDate || '날짜 미정';
  const courses: PartyCourse[] = partyInfo?.courses || [];

  // 코스 수 및 인덱스 계산
  const totalCourses = courses.length;
  // FIND 모드에서만 currentCourseIndex가 필요하며, MidFindData에 있습니다.
  const currentCourseIndex = findData?.currentCourseIndex || 0;
  const isCurrentUserLeader = finalData?.isLeader;

  // 🎯 AI 모드일 때 현재 코스에 해당하는 장소 목록을 미리 추출
  let aiPlacesToRender: RecommendedPlace[] | null = null;
  const midCourseMode = findData?.courseMode; // findData에서 courseMode 가져오기

  if (isFindMode && findData && midCourseMode === 'AI_COURSE' && findData.aiRecommendList) {
    const targetCourseNo = currentCourseIndex + 1;
    const currentAICourse = findData.aiRecommendList.find((aiCourse) => aiCourse.courseNo === targetCourseNo);
    aiPlacesToRender = currentAICourse?.places || null;
  }

  useEffect(() => {
    // ⚠️ 1. findData가 null이 아닐 때만 실행
    if (!findData && !finalData) return;

    // 2. MapData 추출 로직
    const extractPoints = () => {
      const dataToProcess = findData || finalData; // 두 모드 중 하나를 사용

      if (!dataToProcess || !dataToProcess.party) return [];

      const { party } = dataToProcess;
      const newPoints: Point[] = [];

      // 🎯 1. 중간 지점 좌표 추가
      if (party.midPointLat && party.midPointLng) {
        newPoints.push({
          lat: party.midPointLat,
          lng: party.midPointLng,
          name: '계산된 중간 지점',
          type: 'midpoint',
        });
      }

      // 🎯 2. (CUSTOM 모드) 사용자가 선택한 장소 데이터 추가
      // findData.placeData는 사용자가 상세 보기/선택한 장소라고 가정
      if (findData && findData.placeData && findData.placeData.lat && findData.placeData.lng) {
        newPoints.push({
          lat: findData.placeData.lat,
          lng: findData.placeData.lng,
          name: findData.placeData.placeName,
          type: 'selected',
        });
      }

      // 🎯 3. (AI/VIEW 모드) 현재 선택된 코스 장소들 추가
      const placesInCourse = courses.flatMap((c) => (c.places ? [c.places] : [])); // courses 배열에서 장소 추출
      placesInCourse.forEach((p) => {
        if (p.lat && p.lng) {
          newPoints.push({
            lat: p.lat,
            lng: p.lng,
            name: p.placeName,
            type: 'selected',
          });
        }
      });

      console.log(mapPoints);

      return newPoints;
    };

    const extractedPoints = extractPoints();
    setMapPoints(extractedPoints);

    // ⚠️ 3. 의존성 배열 수정: findData, finalData, courses가 변경될 때마다 재실행
  }, [findData, finalData, courses]); // courses도 상태 변경 시 재실행되도록 포함

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
        console.log(isFirst, isLast);
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
        <div className='text-lg font-medium text-gray-700 mt-2 md:mt-0'>날짜: {partyDate}</div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm'>
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
