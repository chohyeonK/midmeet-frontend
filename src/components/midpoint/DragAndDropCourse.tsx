import React, { useState } from 'react';
import type { PartyCourse } from '../../types/MidCommonTypes';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DragAndDropCourseProps {
  course: PartyCourse;
  index: number;
  currentIndex: number;
  className: string;
}

// 드래그 핸들 (세 개의 점 아이콘)
const DragHandle = () => (
  <svg className='w-5 h-5 cursor-grab text-gray-400 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
  </svg>
);

const DragAndDropCourse: React.FC<DragAndDropCourseProps> = ({ course, index, currentIndex, className }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.courseNo.toString() }); // 🚨 courseNo를 ID로 사용
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0, // 드래그 중인 아이템을 위로 올립니다.
    opacity: isDragging ? 0.8 : 1,
  };

  // 숨김 기능 관련
  const [isHidden, setIsHidden] = useState(false);
  const statusText = isHidden ? '숨김 ON' : '숨김 OFF';
  const statusClasses = isHidden
    ? 'bg-gray-700 text-white hover:bg-gray-800' // ON 상태 스타일
    : 'bg-gray-200 text-gray-400'; // OFF 상태 스타일
  return (
    <div
      ref={setNodeRef} // DND 노드 참조 연결
      style={style} // 스타일 연결
      className={`
                flex items-center justify-between p-3 border transition duration-150 h-full
                ${isDragging ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'bg-white hover:bg-gray-50 border-white'}
                ${currentIndex === index ? 'border-2 border-mint-500' : ''}
                rounded-r-lg rounded-l-none
                ${className}
            `}
    >
      <div className='flex items-center text-center'>
        <div {...listeners} {...attributes}>
                    <DragHandle /> 
        </div>
        <div className=''>
                    <div>{course.places.placeName}</div>
        </div>
      </div>
      {/*      {' '}
      <div className={`p-2 rounded cursor-pointer text-sm font-semibold transition duration-150 ${statusClasses}`} onClick={() => setIsHidden((prev) => !prev)}>
        {statusText}
      </div> */}
    </div>
  );
};

export default DragAndDropCourse;
