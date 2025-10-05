import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import CourseItem from './CourseItem';
import type { Course, PartyFormData } from '../../pages/party/Create';

interface StepCourseProps {
  data: PartyFormData;
  onUpdateFormData: (data: Partial<PartyFormData>) => void;
}

const StepCourse: React.FC<StepCourseProps> = ({ data, onUpdateFormData }) => {
  const handleAddCourse = () => {
    const newIndex = data.courseList.length + 1;
    const newCourse = { course_no: newIndex, tag: '' };
    onUpdateFormData({ courseList: [...data.courseList, newCourse] });
  };

  const handleRemoveCourse = (index: number) => {
    const updatedCourseList = data.courseList.filter((_, i) => i !== index);
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
          <CourseItem key={course.course_no} index={index} course={course} onUpdate={handleUpdateCourse} onRemove={handleRemoveCourse} />
        ))}
        <Button onClick={handleAddCourse} buttonName='코스 추가' />
      </div>
    </div>
  );
};

export default StepCourse;
