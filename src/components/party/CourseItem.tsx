import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import type { Course } from '../../pages/party/Create';
import Input from '../common/Input';
import TagSelector from './TagSelector';

interface CourseItemProps {
  index: number;
  course: Course;
  onUpdate: (index: number, updatedCourse: Course) => void;
  onRemove: (index: number) => void;
}

const allTags = [
  '한식',
  '양식',
  '일식',
  '중식',
  '고기',
  '해산물',
  '분식',
  '디저트',
  '카페',
  '술집',
  '밥집',
  '루프탑',
  '바(Bar)',
  '오마카세',
  '시끌벅적',
  '조용한',
  '분위기 좋은',
  '가성비',
  '모던한',
  '캐주얼한',
  '따뜻한',
  '식사',
  '가볍게 한잔',
  '진지한 대화',
  '데이트',
  '스터디',
  '회식',
  '쇼핑',
  '산책',
  '영화',
  '전시회',
];

const CourseItem: React.FC<CourseItemProps> = ({ index, course, onUpdate, onRemove }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(course.tag ? course.tag.split(',').map((t) => t.trim()) : []);

  const handleTagClick = (tag: string) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }

    setSelectedTags(updatedTags);
    onUpdate(index, { ...course, tag: updatedTags.join(', ') });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((t) => t.trim());
    setSelectedTags(tags);
    onUpdate(index, { ...course, tag: e.target.value });
  };

  return (
    <>
      <div className='flex flex-col space-y-2 p-4 border-2 border-dotted rounded-md my-2'>
        <div className='flex items-center space-x-2'>
          <p>코스 {index + 1}</p>
          <Input type='text' name='course' value={selectedTags.join(', ')} onChange={handleInputChange} className='flex-1' />
          <Button onClick={() => onRemove(index)} className='bg-red-500' buttonName='삭제' />
        </div>

        <div className='mt-2'>
          <TagSelector allTags={allTags} selectedTags={selectedTags} onTagClick={handleTagClick} />
        </div>
      </div>
    </>
  );
};

export default CourseItem;
