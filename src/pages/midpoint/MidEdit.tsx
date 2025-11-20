import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import type { PartyCourse, PartyData, Point } from '../../types/MidCommonTypes';
import { MOCK_MID_EDIT_DATA } from '../../data/mockPartyResult';
import { arrayMove } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core'; // 💡 Dnd Kit 핵심
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'; // 💡 순서 변경 모듈
import DragAndDropCourse from '../../components/midpoint/DragAndDropCourse';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { format, parse } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import Map from '../../components/midpoint/Map';
import axios from 'axios';

const CustomDatePickerInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => (
  <input type='text' className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700' value={value} onClick={onClick} onChange={onChange} ref={ref} />
));

// PartyData를 불러서 가져오는게 아니라 밑에 빼야할수도
const MidEdit: React.FC<PartyData> = () => {
  const { partyId } = useParams();
  const navigate = useNavigate();
  const partyData = MOCK_MID_EDIT_DATA;
  const { partyDate, midPoint, courses } = partyData;
  const [coursesList, setCourses] = useState<PartyCourse[]>(courses);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [partyName, setPartyName] = useState(partyData.partyName);
  const [mapPoints, setMapPoints] = useState<Point[]>([]);
  //   console.log(partyData);

  // 날짜 포맷 후 초기 세팅
  const initialDateString = partyDate; // 예: '2025.12.25 오후 7시'
  const FORMAT_STRING = 'yyyy.MM.dd aa h시';
  const parsedDate = parse(initialDateString, FORMAT_STRING, new Date(), { locale: ko });
  const [date, setDate] = useState<Date | null>(!isNaN(parsedDate.getTime()) ? parsedDate : null);

  // 드래그 핸들 이벤트
  const handleDragEnd = useCallback(
    (event: { active: any; over: any }) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      setCourses((prevCoursesList) => {
        const oldIndex = prevCoursesList.findIndex((course) => course.courseNo.toString() === active.id);
        const newIndex = prevCoursesList.findIndex((course) => course.courseNo.toString() === over.id);
        console.log(oldIndex, newIndex);

        if (oldIndex === -1 || newIndex === -1) return prevCoursesList;

        // 최신 상태(prevCoursesList)를 기반으로 배열 재정렬 (순서만 변경됨)
        const reorderedCourses = arrayMove(prevCoursesList, oldIndex, newIndex);

        // currentCourseIndex 업데이트
        setCurrentCourseIndex(newIndex);

        return reorderedCourses;
      });
    },
    [setCourses, setCurrentCourseIndex],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartyName(e.target.value);
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const SubmitPartyData = async () => {
    try {
      // 파티명, 파티id, 모임장, 날짜/시간, 코스(코스no만 변경될 것)
      // 날짜 포맷 -> string
      let formattedDate = '';
      if (date !== null) {
        formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
        console.log('포맷된 날짜: ', formattedDate);
      }
      // 코스 재정렬된 순서대로 재정렬
      const finalCoursesList = coursesList.map((course, index) => {
        // 배열의 현재 인덱스(0, 1, 2...)를 기반으로 courseNo를 1부터 다시 매깁니다.
        return {
          ...course,
          courseNo: index + 1, // 1, 2, 3...
        };
      });

      // 최종 데이터 객체 구성
      // const finalPartyData = {
      //   party_name: partyName,
      //   date_time: formattedDate,
      //   party_type: ,
      //   party_state: true
      //   // midPoint: partyData.midPoint,
      //   // midPointLat: partyData.midPointLat,
      //   // midPointLng: partyData.midPointLng,
      //   // courses: finalCoursesList, // 코스 리스트: no 바뀐 결과로 수정해야 함
      // };

      // console.log('최종 데이터: ', finalPartyData);
      // 백엔드 api 연동 필요(현재는 성공했다는 전제하에 결과 페이지 리다이렉트)
      // const baseURL = import.meta.env.VITE_API_URL;
      // // party 테이블 수정
      // const response = await axios.post(`${baseURL}/user/reset-password`, finalPartyData);
      // // course 테이블 수정

      alert('모임 정보가 수정되었습니다.');
      navigate('/midpoint/result'); // partyId 붙여야함
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    const midpointPoint: Point = {
      lat: partyData.midPointLat,
      lng: partyData.midPointLng,
      name: partyData.midPoint,
      type: 'midpoint',
    };

    const coursePoints: Point[] = coursesList.flatMap((course, index) =>
      course.places.lat && course.places.lng
        ? [
            {
              lat: course.places.lat,
              lng: course.places.lng,
              name: course.places.placeName,
              type: 'selected',
              index: index + 1,
            },
          ]
        : [],
    );

    setMapPoints([midpointPoint, ...coursePoints]);

    // coursesList가 변경될 때마다 재실행
  }, [coursesList, partyData.midPointLat, partyData.midPointLng, partyData.midPoint]); // partyData의 관련 필드도 포함

  return (
    <>
      <div className='max-w-6xl mx-auto text-left'>
        <div className='mb-6'>
          <div className='text-3xl font-semibold mr-4 mb-2'>기본 정보 수정</div>
          <div className='flex'>
            <div className='mr-4'>
              <div className='text-left mb-1 text-lg font-medium text-gray-700'>모임명</div>
              <Input type='text' name='partyName' value={partyName} onChange={handleNameChange} />
            </div>
            <div>
              <div className='text-left mb-1 text-lg font-medium text-gray-700'>날짜/시간</div>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat='yyyy년 MM월 dd일 h:mm aa'
                showTimeSelect
                timeFormat='h:mm aa'
                timeIntervals={15}
                timeCaption='시간'
                locale={ko}
                placeholderText='날짜와 시간을 선택하세요'
                customInput={<CustomDatePickerInput />}
              />
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <div className='text-3xl font-semibold mr-4 mb-2'>전체 경로 수정</div>
          <div className='text-left mb-1 text-lg font-medium text-gray-700'>중간 지점: {midPoint}</div>
        </div>

        <div className='mb-6'>
          <div className='bg-gray-100 border border-gray-300 rounded-lg shadow-sm w-full' style={{ height: '350px' }}>
            <Map points={mapPoints} />
          </div>
        </div>

        <div className='mb-6'>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={coursesList.map((course) => course.courseNo.toString())} strategy={verticalListSortingStrategy}>
              <div className='space-y-2'>
                {coursesList.map((course, index) => (
                  <div key={course.courseNo} className='flex items-stretch h-full text-center'>
                    <div className='w-12 p-3 bg-emerald-500 rounded-l-lg flex items-center justify-center text-white text-lg font-bold'>{index + 1}</div>
                    <DragAndDropCourse key={course.courseNo} course={course} index={index} currentIndex={currentCourseIndex} className='flex-grow' />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className='flex justify-end'>
          <Button buttonName='취소' className='mr-2 bg-gray-300' onClick={handleCancel} />
          <Button buttonName='수정' onClick={SubmitPartyData} />
        </div>
      </div>
    </>
  );
};

export default MidEdit;
