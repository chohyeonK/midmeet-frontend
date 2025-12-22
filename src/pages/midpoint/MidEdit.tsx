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
import { format, parse, parseISO } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import Map from '../../components/midpoint/Map';
import axios from 'axios';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const CustomDatePickerInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => (
  <input type='text' className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700' value={value} onClick={onClick} onChange={onChange} ref={ref} />
));

const getTokenFromStorage = () => localStorage.getItem('token') || null;

// PartyData를 불러서 가져오는게 아니라 밑에 빼야할수도
const MidEdit: React.FC = () => {
  const token = getTokenFromStorage();
  const { partyId } = useParams();
  const navigate = useNavigate();
  // const partyData = MOCK_MID_EDIT_DATA;
  // const { courses } = partyData;
  const [coursesList, setCoursesList] = useState<PartyCourse[]>([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  // const [mapPoints, setMapPoints] = useState<Point[]>([]);
  const [partyDate, setPartyDate] = useState<Date | null>(() => {
    // 처음 컴포넌트가 뜰 때 실행될 초기값 계산 로직
    // 만약 props나 초기 변수가 없다면 null을 반환하도록 설계
    const initialValue = '2025.12.25 오후 7시'; // 실제로는 외부 변수 등을 사용하시겠죠?
    const FORMAT_STRING = 'yyyy.MM.dd aa h시';
    const parsed = parse(initialValue, FORMAT_STRING, new Date(), { locale: ko });

    return !isNaN(parsed.getTime()) ? parsed : null;
  });

  const [partyName, setPartyName] = useState<string>('');
  const [midPoint, setMidPoint] = useState<string>('');
  const [midCoords, setMidCoords] = useState({ lat: 0, lng: 0 }); // 중간 지점 좌표 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  // const [partyState, setPartyState] = useState<string>('');
  // const [partyType, setParty] = useState<string>('');

  // 초기 모임 데이터 가져오기
  const getPartyData = async () => {
    setIsLoading(true);

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const [partyRes, secondRes] = await Promise.all([
        axios.get(`${baseURL}/party/${partyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${baseURL}/party/${partyId}/course`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (partyRes.status === 200 && secondRes.status === 200) {
        // 첫 번째 요청 처리
        const { party_name, date_time, mid_lat, mid_lng, mid_place, party_state, party_type } = partyRes.data;
        console.log(partyRes.data);

        setPartyName(party_name);
        setMidPoint(mid_place);

        const parsedDate = parseISO(date_time);
        if (!isNaN(parsedDate.getTime())) {
          setPartyDate(parsedDate);
        }

        // const midpointPoint: Point = {
        //   lat: mid_lat,
        //   lng: mid_lng,
        //   name: midPoint,
        //   type: 'midpoint',
        // };

        // 두 번째 요청 처리
        // console.log(secondRes);
        // const coursePoints: Point[] = secondRes.data.courses.flatMap((course: { places: { lat: any; lng: any; placeName: any } }, index: number) =>
        //   course.places.lat && course.places.lng
        //     ? [
        //         {
        //           lat: course.places.lat,
        //           lng: course.places.lng,
        //           name: course.places.placeName,
        //           type: 'selected',
        //           index: index + 1,
        //         },
        //       ]
        //     : [],
        // );

        // console.log(secondRes);
        setCoursesList(secondRes.data.courses);

        setMidCoords({ lat: Number(mid_lat), lng: Number(mid_lng) }); // 🎯 좌표 상태 업데이트
        setCoursesList(secondRes.data.courses); // 🎯 코스 리스트 업데이트
        // setMapPoints([midpointPoint, ...coursePoints]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 드래그 핸들 이벤트
  const handleDragEnd = useCallback(
    (event: { active: any; over: any }) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      setCoursesList((prevCoursesList) => {
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
    [setCoursesList, setCurrentCourseIndex],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartyName(e.target.value);
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setPartyDate(newDate);
    }
  };

  // 코스 숨김 제어 기능 추후 개발
  // const handlePartyActive = (targetId: string) => {
  //   console.log('숨김 코스 아이디: ', targetId);
  //   setCoursesList((prevList) => prevList.map((course) => (course.courseId === targetId ? { ...course, courseView: !course.courseView } : course)));
  //   console.log('완료 후 코스 리스트: ', coursesList);
  // };

  const SubmitPartyData = async () => {
    try {
      setIsLoading(true);
      // 날짜 포매팅
      let formattedDate = '';
      if (partyDate !== null) {
        formattedDate = format(partyDate, "yyyy-MM-dd'T'HH:mm:ss");
        // console.log('포맷된 날짜: ', formattedDate);
      }
      // 코스 재정렬된 순서대로 재정렬
      const finalCoursesList = coursesList.map((course, index) => {
        // 배열의 현재 인덱스(0, 1, 2...)를 기반으로 courseNo를 1부터 다시 매깁니다.
        return {
          // ...course,
          course_no: index + 1, // 1, 2, 3...
          course_id: course.courseId,
          // course_view: course.courseView, // 추후 개발
          place_lat: Number(course.places.lat),
          place_lng: Number(course.places.lng),
          place_name: course.places.placeName,
          place_address: course.places.placeAddr,
        };
      });

      const requestBody = {
        courses: finalCoursesList,
      };

      // 최종 데이터 객체 구성
      const finalPartyData = {
        party_name: partyName,
        date_time: formattedDate,
      };

      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.patch(`${baseURL}/party/${partyId}`, finalPartyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const baseURL = import.meta.env.VITE_API_URL;
        const couresesRes = await axios.patch(`${baseURL}/party/${partyId}/courseArray`, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('requestBody', requestBody);
        console.log(couresesRes);

        if (couresesRes.status === 200) {
          alert('모임 정보가 수정되었습니다.');
          // navigate('/midpoint/result'); // partyId 붙여야함
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const mapPoints = React.useMemo(() => {
    const points: Point[] = [];

    // 1. 중간 지점 추가 (좌표가 있을 때만)
    // midCoords.lat이 0이 아닐 때만 추가하도록 조건을 완화합니다.
    console.log(midCoords);
    if (midCoords.lat !== 0 && midCoords.lng !== 0) {
      points.push({
        lat: midCoords.lat,
        lng: midCoords.lng,
        name: midPoint || '중간 지점', // midPoint 상태가 아직 비어있다면 기본값 출력
        type: 'midpoint',
      });
    }

    // 2. 코스 지점 추가 (순서대로 1, 2, 3... 번호 부여)
    const coursePoints = coursesList.flatMap((course, index) => {
      const lat = Number(course.places?.lat);
      const lng = Number(course.places?.lng);

      // 유효한 좌표가 있는 경우만 마커 생성
      if (!lat || !lng) return [];

      return [
        {
          lat,
          lng,
          name: course.places.placeName,
          type: 'selected',
          index: index + 1, // 드래그 순서에 따라 자동으로 인덱스 부여
        },
      ];
    });

    return [...points, ...coursePoints];
  }, [coursesList, midCoords, midPoint]); // 💡 이 세 상태 중 하나만 바뀌어도 지도가 즉시 갱신됨

  useEffect(() => {
    getPartyData();
  }, []);

  return (
    <>
      <LoadingOverlay isOverlay={true} isActive={isLoading} />

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
                selected={partyDate}
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
                    {/* <DragAndDropCourse key={course.courseNo} course={course} index={index} currentIndex={currentCourseIndex} className='flex-grow' /> */}
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
