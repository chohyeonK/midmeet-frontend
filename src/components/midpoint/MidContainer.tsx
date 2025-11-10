import React, { useEffect, useState } from 'react';
import MidPlaceItem from './MidPlaceItem';
import MidPlaceDetail from './MidPlaceDetail';
import Button from '../common/Button';
import CourseRouteViewer from './CourseRouteViewer';
import type { RecommendedPlace, PartyData } from '../../types/MidFindTypes';
import type { CourseSummary, FinalCourse, FinalPartyResult } from '../../types/PartyResultTypes';
import MemberRouteDetail from './MemberRouteDetail';

export type ViewMode = 'FIND' | 'VIEW';
interface MidContainerProps {
  mode: ViewMode;
  resultData: PartyData | FinalPartyResult;

  // FIND 모드 전용 핸들러 (선택적)
  handleNext?: () => void;
  handlePrev?: () => void;
  handleSave?: () => void;
  onPlaceSelect?: (place: RecommendedPlace) => void;
}

const transformCourseToRecommendedPlace = (course: FinalCourse | CourseSummary): RecommendedPlace => {
  return {
    placeId: course.courseId,
    placeName: course.courseName,
    address: course.finalAddress,
    // '인기메뉴' 자리에 '코스 유형' 정보 표시
    hitMenu: course.hitMenu,
    review: undefined,
  };
};

const MidContainer: React.FC<MidContainerProps> = ({ mode, resultData, handleNext, handlePrev, handleSave, onPlaceSelect }) => {
  // ✅ 1. Type Guard 함수 (최상위에서 정의)
  const isFinalResult = (data: PartyData | FinalPartyResult): data is FinalPartyResult => {
    return 'midPointLat' in data;
  };

  const isFindMode = mode === 'FIND';
  const isViewMode = mode === 'VIEW';

  // ✅ 2. 최상위에서 데이터 타입을 분기하고 변수에 할당
  //    (함수 호출 전에 반드시 실행됨)
  const finalData: FinalPartyResult | null = isViewMode && isFinalResult(resultData) ? (resultData as FinalPartyResult) : null;
  const findData: PartyData | null = isFindMode && !isFinalResult(resultData) ? (resultData as PartyData) : null;

  // ✅ 3. 공통 데이터 추출 (널 병합 연산자 || 사용)
  const partyName = finalData?.partyName || findData?.partyName || '모임명 미정';
  const midPoint = finalData?.midPointName || findData?.midPoint || '중간 지점 미정';
  const partyDate = finalData?.partyDate || findData?.partyDate || '날짜 미정';

  // courses 배열도 분기 처리
  // VIEW 모드에서는 FinalPartyResult의 courses를, FIND 모드에서는 PartyData의 courseList를 사용합니다.
  // const courses = finalData?.courses || findData?.recommendList || [];
  const courses = (finalData?.courses as any) || findData?.courseList || [];
  console.log('coursessssssss', courses);

  // ... (나머지 isFirst, isLast 계산은 courses를 기반으로 수행)
  const totalCourses = courses.length;
  const currentCourseIndex = findData?.currentCourseIndex || 0; // FIND 모드에서만 인덱스 필요

  const isCurrentUserLeader = finalData?.isLeader;

  const renderContent = () => {
    if (isFindMode && findData) {
      return (
        <>
          <div className='mb-6'>
            <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>장소를 골라주세요!</div>
            <div className='flex flex-nowrap overflow-x-auto space-x-4 items-stretch'>
              {findData.recommendList &&
                findData.recommendList.map((place, index) => {
                  return <MidPlaceItem key={place.placeName} index={index} data={place} onClickDetail={onPlaceSelect} mode={mode} />;
                })}
            </div>
          </div>
          {findData.placeData && <MidPlaceDetail place={findData.placeData} />}
        </>
      );
    } else if (isViewMode && finalData) {
      return (
        <>
          <div className='mb-6'>
            <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>코스가 확정되었습니다!</div>
            <div className='flex flex-nowrap overflow-x-auto space-x-4 items-stretch'>
              {finalData.courses &&
                finalData.courses.map((place, index) => {
                  const recommendedPlaceData = transformCourseToRecommendedPlace(place);
                  return <MidPlaceItem key={place.courseName} index={index} data={recommendedPlaceData} onClickDetail={onPlaceSelect} mode={mode} />;
                })}
            </div>
          </div>
          {finalData.placeData && <MidPlaceDetail place={transformCourseToRecommendedPlace(finalData.placeData)} />}

          <div className='mb-6'>
            <div className='text-left mb-3 text-2xl font-semibold text-gray-900'>모임원별 가는 방법</div>
            {finalData.members.map((member, index) => {
              // ✅ 이 member가 방장인지 판단합니다. (API 응답에 userId가 있어야 정확함)
              const isThisMemberTheLeader = isCurrentUserLeader && member.name.includes('(나)');

              return <MemberRouteDetail key={member.name} member={member} isLeader={!!isThisMemberTheLeader} />;
            })}
          </div>
        </>
      );
    }
  };

  const renderButtons = () => {
    if (isFindMode && findData) {
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

      {/* 콘텐츠 영역 분기 */}
      {renderContent()}

      <div className='mt-8'>{renderButtons()}</div>
    </div>
  );
};

export default MidContainer;
