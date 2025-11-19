import React from 'react';
import type { PartyCourse } from '../../types/MidCommonTypes';

interface Course {
  courses: PartyCourse[];
  currentIndex?: number;
}

const CourseRouteViewer: React.FC<Course> = ({ courses, currentIndex }) => {
  // console.log('내부 코스 경로: ', courses);
  return (
    <>
      <h3 className='text-lg font-bold mb-3'>전체 모임 경로(총 {courses.length}개 코스)</h3>
      <div className='space-y-3'>
        {courses.map((course, index) => {
          // ✅ 현재 활성화된 코스인지 확인
          const isActive = index === currentIndex;
          const placeName = course.places?.placeName || '장소 미정';

          // ✅ 조건부 클래스 정의
          const itemClass = isActive
            ? 'bg-indigo-50 border-indigo-300 font-bold' // 활성화된 항목 스타일
            : 'bg-white hover:bg-gray-50 border-white'; // 비활성화된 항목 스타일

          const numCircleClass = isActive
            ? 'bg-indigo-600 text-white' // 활성화된 번호 스타일
            : 'bg-gray-200 text-gray-500'; // 비활성화된 번호 스타일

          return (
            <div
              key={index}
              // ✅ 클릭 이벤트가 있다면 여기에 추가 (setCurrentCourseIndex(index))
              className={`flex items-center p-3 rounded-lg border transition duration-150 cursor-pointer ${itemClass}`}
            >
              {/* ✅ 1. 순번 원형 아이콘 */}
              <div className={`w-6 h-6 flex items-center justify-center text-xs rounded-full mr-3 font-bold ${numCircleClass}`}>{index + 1}</div>
              {/* ✅ 2. 코스 이름 */}
              <div className='flex-1 text-sm'>{placeName}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CourseRouteViewer;
