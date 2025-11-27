import React, { useState } from 'react';
import PartyFormContainer from '../../components/party/PartyContainer';
import StepFormGuest from '../../components/Guest/StepFormGuest';
import StepForm from '../../components/party/StepForm';
import StepCourse from '../../components/party/StepCourse';
import { emptyTagData, type TransformedTagData } from '../party/Create';
import type { SubmitHandler } from 'react-hook-form';
import type { GuestPartyFormData } from '../../types/GuestTypes';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';

const GuestCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false); // 초기 로딩 상태는 true
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<GuestPartyFormData>({
    name: '',
    date: null,
    numberOfPeople: 2,
    members: [],
    courseList: [
      {
        course_id: Date.now(),
        course_no: 1,
        tag: emptyTagData,
      },
    ],
  });

  const handleUpdateCount = (newCount: number) => {
    setFormData((prevData) => ({ ...prevData, numberOfPeople: newCount }));
  };

  const handleUpdateFormData = (data: Partial<GuestPartyFormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleNext = (data: Partial<GuestPartyFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setStep((prev) => prev + 1);
  };

  const isTagDataEmpty = (tag: TransformedTagData | null): boolean => {
    if (!tag || !tag.category) {
      return true;
    }

    // primaryQueries와 secondaryFilters 배열이 모두 비어있으면 비어있음
    if (tag.primaryQueries.length === 0 && tag.secondaryFilters.length === 0) {
      return true;
    }

    // 태그가 하나라도 있으면 false (비어있지 않음)
    return false;
  };

  const onSubmit: SubmitHandler<GuestPartyFormData> = async () => {
    // console.log('최종 데이터', formData);

    try {
      // 유효성 검사
      if (!formData.name.trim()) {
        alert('모임명을 입력해주세요.');
        return;
      }

      if (!formData.date) {
        alert('모임 날짜를 선택해주세요.');
        return;
      }

      const isAnyCourseTagEmpty = formData.courseList.some((course) => {
        return isTagDataEmpty(course.tag);
      });

      if (isAnyCourseTagEmpty) {
        alert('모든 코스에 최소 1개 이상의 태그를 지정해야 합니다.');
        return;
      }

      setIsLoading(true);

      // 날짜 포매팅
      let formattedDate = null;
      if (formData.date) {
        formattedDate = format(formData.date, "yyyy-MM-dd'T'HH:mm:ss");
      }

      const payload = {
        party: {
          party_name: formData.name,
          date_time: formattedDate,
        },
        participants: formData.members.map((member) => ({
          participant_name: member.name,
          transport_mode: member.transportMode,
          start_address: member.startAddr,
        })),
        courses: formData.courseList.map((course) => ({
          course_id: String(course.course_id),
          course_no: course.course_no,
          tag: course.tag,
        })),
      };

      console.log('보낸 데이터: ', payload);

      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${baseURL}/party/guest`, payload);
      console.log('보낸 데이터 응답: ', response);
      const tempResponse = 200;

      if (response.status === 200) {
        setIsLoading(false);
        // 데이터 받아서 페이지 리다이렉트
        // 임시 결과 데이터
        // const tempResult = {
        //   party: {
        //     partyName: '정윤초현',
        //     partyDate: '2025-11-27T17:30:00',
        //     midPoint: '달월',
        //     midPointLat: 37.37968,
        //     midPointLng: 126.74518,
        //     partyType: 'AI_COURSE',
        //     courses: [
        //       {
        //         courseNo: 1,
        //         courseId: '1764057612380',
        //         places: {
        //           placeId: '',
        //           placeName: '',
        //           placeAddr: '',
        //           lat: 0,
        //           lng: 0,
        //         },
        //       },
        //       {
        //         courseNo: 2,
        //         courseId: '1764057645831',
        //         places: {
        //           placeId: '',
        //           placeName: '',
        //           placeAddr: '',
        //           lat: 0,
        //           lng: 0,
        //         },
        //       },
        //     ],
        //   },
        //   list: [
        //     {
        //       courseId: '241040',
        //       courseNo: 1,
        //       courseName: '거리우선 추천코스',
        //       places: [
        //         {
        //           placeId: '1764057612380',
        //           placeName: '평이담백 뼈칼국수 신세계아울렛시흥프리미엄',
        //           placeAddr: '경기 시흥시 배곧동 36',
        //           lat: 37.3797942465734,
        //           lng: 126.73835989687,
        //         },
        //         {
        //           placeId: '1764057645831',
        //           placeName: '소바공방 신세계아울렛시흥프리미엄',
        //           placeAddr: '경기 시흥시 배곧동 36',
        //           lat: 37.379701214667634,
        //           lng: 126.7382574734017,
        //         },
        //       ],
        //     },
        //     {
        //       courseId: '597064',
        //       courseNo: 2,
        //       courseName: '인기우선 추천코스',
        //       places: [
        //         {
        //           placeId: '1764057612380',
        //           placeName: '만석씨푸드 본점',
        //           placeAddr: '경기 시흥시 배곧동 18-7',
        //           lat: 37.3823736934317,
        //           lng: 126.735847666764,
        //         },
        //         {
        //           placeId: '1764057645831',
        //           placeName: '히바린 신세계아울렛시흥프리미엄',
        //           placeAddr: '경기 시흥시 배곧동 36',
        //           lat: 37.37991044534868,
        //           lng: 126.73591276097015,
        //         },
        //       ],
        //     },
        //     {
        //       courseId: '217073',
        //       courseNo: 3,
        //       courseName: 'AI추천 코스',
        //       places: [
        //         {
        //           placeId: '1764057612380',
        //           placeName: '정든한우 소머리국밥 배곧신도시점',
        //           placeAddr: '경기 시흥시 배곧동 18-4',
        //           lat: 37.382261905478764,
        //           lng: 126.73501476645305,
        //         },
        //         {
        //           placeId: '1764057645831',
        //           placeName: '사보텐 신세계배곧점',
        //           placeAddr: '경기 시흥시 배곧동 36',
        //           lat: 37.37990079861863,
        //           lng: 126.73846453181277,
        //         },
        //       ],
        //     },
        //   ],
        // };
        console.log('성공');
        sessionStorage.setItem('partyCreationResult', JSON.stringify(response.data));
        sessionStorage.setItem('partyMembers', JSON.stringify(payload.participants));
        navigate('/guest/start');
      }
    } catch (error) {
      console.log(error);
      //   if (axios.isAxiosError(error) && error.response) {
      //     if (error.response.status === 403) {
      //       alert(error.response.data.message);
      //     }
      //   } else {
      //     alert('저장하는데 오류가 발생하였습니다. 다시 시도하여 주시기 바랍니다.');
      //   }
    }

    //     {
    //   "party": {
    //     "date_time": "2025-01-10T18:00:00.000Z",
    //     "party_name": "저녁 모임",
    //     "party_type": "CUSTOM_COURSE"
    //   },
    //   "participants": [
    //     {
    //       "participant_name": "홍길동",
    //       "transport_mode": "PUBLIC",
    //       "start_address": "서울시 강남구 테헤란로 123"
    //     },
    //     {
    //       "participant_name": "김철수",
    //       "transport_mode": "CAR",
    //       "start_address": "서울시 서초구 서초대로 45"
    //     }
    //   ],
    //   "courses": [
    //     {
    //       "course_id": "course_1",
    //       "course_no": 1,
    //       "tag": {
    //         "main": "cafe",
    //         "detail": ["디저트", "브런치"]
    //       }
    //     },
    //     {
    //       "course_id": "course_2",
    //       "course_no": 2,
    //       "tag": {
    //         "main": "restaurant",
    //         "detail": ["한식", "고기"]
    //       }
    //     }
    //   ]
    // }

    // try {
    //   if (!formData.name.trim()) {
    //     alert('모임명을 입력해주세요.');
    //     return;
    //   }

    //   if (!formData.date) {
    //     alert('모임 날짜를 선택해주세요.');
    //     return;
    //   }

    //   // 코스 목록 유효성 검사(태그가 최소 1개 이상인지)
    //   const isAnyCourseTagEmpty = formData.courseList.some((course) => {
    //     return isTagDataEmpty(course.tag);
    //   });

    //   if (isAnyCourseTagEmpty) {
    //     alert('모든 코스에 최소 1개 이상의 태그를 지정해야 합니다.');
    //     return;
    //   }

    //   const token = getTokenFromStorage();
    //   let formattedDate = null;
    //   if (formData.date) {
    //     formattedDate = format(formData.date, "yyyy-MM-dd'T'HH:mm:ss");
    //   }
    //   const partyPayload = {
    //     party_name: formData.name,
    //     participant_count: formData.numberOfPeople,
    //     date_time: formattedDate,
    //     party_type: formData.midpointMethod,
    //   };

    //   // console.log(formData);

    //   const baseURL = import.meta.env.VITE_API_URL;
    //   const partyResponse = await axios.post(`${baseURL}/party`, partyPayload, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   if (partyResponse.status === 200) {
    //     // 공유 링크 저장
    //     const { party_id } = partyResponse.data;

    //     setParty(party_id);

    //     const coursePayload = {
    //       courses: formData.courseList,
    //     };

    //     const baseURL = import.meta.env.VITE_API_URL;
    //     const courseResponse = await axios.post(`${baseURL}/party/${party_id}/course`, coursePayload, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });

    //     if (courseResponse.status === 200) {
    //       navigate('/party/success');
    //     }
    //   }
    // } catch (error) {
    //   // console.log(error);
    //   // 이메일 인증 안받은 유저가 모임 생성 시 에러 처리
    //   if (axios.isAxiosError(error) && error.response) {
    //     if (error.response.status === 403) {
    //       alert(error.response.data.message);
    //     }
    //   } else {
    //     alert('저장하는데 오류가 발생하였습니다. 다시 시도하여 주시기 바랍니다.');
    //   }
    // }
  };

  const steps = [
    <StepForm onUpdateFormData={handleUpdateFormData} data={formData} onUpdateCount={handleUpdateCount} />,
    <StepFormGuest onUpdateFormData={handleUpdateFormData} data={formData} />,
    <StepCourse data={formData} onUpdateFormData={handleUpdateFormData} />,
  ];

  const props = {
    step: step,
    totalSteps: steps.length,
    title: '비회원 모임 생성',
    onPrev: handlePrev,
    onNext: handleNext,
    onSubmit: onSubmit,
  };

  // 로딩 중이거나 필수 데이터(midCourseMode)가 아직 로드되지 않았다면 로딩 컴포넌트를 표시
  if (isLoading) {
    return <Loading title='모임을 생성하여 최적의 만남 장소를 분석하고 있습니다.' message='잠시만 기다려주세요!' />;
  }

  return (
    <>
      <PartyFormContainer {...props}>{steps[step]}</PartyFormContainer>
    </>
  );
};

export default GuestCreate;
