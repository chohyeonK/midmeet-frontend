import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import CourseItem from './CourseItem';
import { emptyTagData, type Course, type PartyFormData } from '../../pages/party/Create';

interface StepCourseProps {
  data: PartyFormData;
  onUpdateFormData: (data: Partial<PartyFormData>) => void;
}

const StepCourse: React.FC<StepCourseProps> = ({ data, onUpdateFormData }) => {
  const handleAddCourse = () => {
    if (data.courseList.length >= 6) {
      alert('코스는 최대 6개 설정할 수 있습니다.');
      return;
    }
    const newIndex = data.courseList.length + 1;
    const newCourse = { course_id: Date.now(), course_no: newIndex, tag: emptyTagData };

    onUpdateFormData({ courseList: [...data.courseList, newCourse] });
  };

  const handleRemoveCourse = (index: number) => {
    if (data.courseList.length === 1) {
      alert('코스는 최소 1개여야 합니다.');
      return;
    }
    const filteredList = data.courseList.filter((_, i) => i !== index);
    const updatedCourseList = filteredList.map((course, i) => ({
      ...course,
      course_no: i + 1,
    }));

    onUpdateFormData({ courseList: updatedCourseList });
  };

  const handleUpdateCourse = (index: number, updatedCourse: Course) => {
    const updatedCourseList = data.courseList.map((course, i) => (i === index ? updatedCourse : course));

    onUpdateFormData({ courseList: updatedCourseList });
  };

  return (
    <div>
      <div className='my-4 text-lg text-gray-500 text-left'>
        카페, 음식점 등 코스를 <br />
        알려주세요!(최대 6개)
      </div>
      <div>
        {data.courseList.map((course, index) => (
          <CourseItem key={course.course_id} index={index} course={course} onUpdate={handleUpdateCourse} onRemove={handleRemoveCourse} />
        ))}
        <Button onClick={handleAddCourse} buttonName='코스 추가' />
      </div>
    </div>
  );
};

export default StepCourse;
