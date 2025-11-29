import React, { useCallback, useEffect, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import type { AIRecommendPlace, MidFindData, RecommendedPlace } from '../../types/MidFindTypes';
import type { PartyCourse, PartyData } from '../../types/MidCommonTypes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const GuestMidFinding: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [props, setProps] = useState<MidFindData | null>(null);
  const midMode = 'FIND';
  const [aiRecommendList, setAiRecommendList] = useState<AIRecommendPlace[] | null>(null);
  const [courses, setCourses] = useState<PartyCourse[]>([]);
  const [placeData, setPlaceData] = useState<RecommendedPlace | null>(null);
  const [memberData, setMemberData] = useState(null);
  const [partyData, setPartyData] = useState<string | null>(null);

  const getData = () => {
    const storedData = sessionStorage.getItem('partyCreationResult');
    const member = sessionStorage.getItem('partyMembers');

    if (storedData && member) {
      // 멤버 세팅
      const parseMember = JSON.parse(member);
      setMemberData(parseMember);

      // 모임 정보 세팅
      let finalPartyResult = JSON.parse(storedData);
      const { party, list } = finalPartyResult;
      console.log('리스트', list);
      setAiRecommendList(list);
      const { partyName, partyDate, midPoint, midPointLat, midPointLng, partyType, courses } = party;
      setPartyData(finalPartyResult);
      setProps({
        party: {
          partyName: partyName,
          partyDate: partyDate,
          midPoint: midPoint,
          midPointLat: midPointLat,
          midPointLng: midPointLng,
          courses: courses,
        } as PartyData,
        courseMode: partyType,
        customRecommendList: [],
        aiRecommendList: list,
        currentCourseIndex: 0,
        placeData: null,
      });
    }

    setIsLoading(false);
  };

  // ai 코스 선택 - 변경 없음
  const onCourseIndexSelect = useCallback(
    (selectedIndex: number) => {
      // console.log('코스선택');
      const selectedPlacesArray = aiRecommendList?.[selectedIndex]?.places;

      if (!selectedPlacesArray || selectedPlacesArray.length === 0) {
        console.warn(`선택된 인덱스 ${selectedIndex}에 대한 장소 목록이 비어 있습니다.`);
        return;
      }

      const newCourses: PartyCourse[] = selectedPlacesArray.map((place, index) => {
        return {
          courseId: aiRecommendList?.[selectedIndex].courseId,
          courseNo: index + 1,
          places: place,
        } as PartyCourse;
      });

      // console.log('새로 클릭함 코스: ', newCourses);

      setCourses(newCourses);

      setProps((prevProps) => {
        if (!prevProps) return null;

        return {
          ...prevProps,
          party: {
            ...prevProps.party,
            courses: newCourses, // 👈 업데이트된 코스 배열을 props에 반영
          },
          // currentCourseIndex를 0으로 초기화하거나 필요한 값으로 설정
          currentCourseIndex: 0,
          // placeData는 MidPlaceDetail이 courses를 기반으로 렌더링되므로, 굳이 setProps에 포함할 필요는 없으나,
          // findData.placeData와 혼동을 피하기 위해 여기서는 생략하거나 null 처리할 수 있습니다.
        };
      });

      setPlaceData(newCourses[0].places); // 첫 코스의 첫 장소를 상세 정보로 설정
    },
    [aiRecommendList], // setCourses, setCurrentCourseIndex, setPlaceData 의존성은 간결화를 위해 제거 가능
  );

  const submitData = async () => {
    // console.log('결과 데이터 만들어야 함');

    const { party } = partyData;
    const { partyName, partyDate, midPoint, midPointLat, midPointLng } = party;

    if (memberData === null) return;

    // 멤버 데이터 전송할 타입 변경
    const participantsPayload = memberData.map((member: any) => ({
      participant_name: member.participant_name,
      start_address: member.start_address,
      transport_mode: member.transport_mode,
    }));

    // 코스 ㅔ이터 전송할 타입 변경
    const coursesPaylod = courses.map((course: any) => ({
      course_id: course.courseId,
      course_no: course.courseNo,
      place_name: course.places.placeName,
      place_Addr: course.places.placeAddr,
      place_lat: course.places.lat,
      place_lng: course.places.lng,
    }));

    const payload = {
      party: {
        party_name: partyName,
        date_time: partyDate,
        mid_place: midPoint,
        mid_lat: midPointLat,
        mid_lng: midPointLng,
      },
      participants: participantsPayload,
      courses: coursesPaylod,
    };

    // console.log('결과 데이터: ', payload);

    // 임시 데이터 추후 삭제
    // const temp = {
    //   party: {
    //     party_name: '정윤초현',
    //     date_time: '2025-11-27T17:30:00',
    //     mid_place: '소새울',
    //     mid_lat: 37.46851,
    //     mid_lng: 126.79728,
    //   },
    //   participants: [
    //     {
    //       participant_name: '정윤',
    //       start_address: '인천 연수구 선학로 100',
    //       transport_mode: 'PUBLIC',
    //     },
    //     {
    //       participant_name: '초현',
    //       start_address: '서울 영등포구 문래로 175',
    //       transport_mode: 'PUBLIC',
    //     },
    //   ],
    //   courses: [
    //     {
    //       course_id: '1764057612380',
    //       course_no: 1,
    //       place_name: '광치꼴',
    //       place_Addr: '경기 부천시 소사구 소사본동 400-3',
    //       place_lat: 37.46795175403592,
    //       place_lng: 126.7982925576838,
    //       tag: {
    //         category: 'FD6',
    //         primaryQueries: ['한식'],
    //         secondaryFilters: ['주차'],
    //       },
    //     },
    //     {
    //       course_id: '1764057645831',
    //       course_no: 2,
    //       place_name: '스시희',
    //       place_Addr: '경기 부천시 소사구 소사본동 400-9',
    //       place_lat: 37.4690615961908,
    //       place_lng: 126.800829647732,
    //       tag: {
    //         category: 'FD6',
    //         primaryQueries: ['일식'],
    //         secondaryFilters: ['주차'],
    //       },
    //     },
    //   ],
    // };

    try {
      setIsLoading(true);

      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${baseURL}/party/guest/result`, payload);

      if (response.status === 200) {
        // 기존 세션 스토리지 삭제 후 백엔드 api 연동
        // 백엔드 response 결과 세션 스토리지 저장 후 페이지 리다이렉트
        sessionStorage.removeItem('partyCreationResult');
        sessionStorage.removeItem('partyMembers');
        sessionStorage.setItem('result', JSON.stringify(response.data));
        navigate('/guest/result');
      }
    } catch (error) {
      console.log(error);
      alert('시스템에 오류가 발생했습니다. 잠시후에 시도하여 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading || props === null) {
    return <LoadingOverlay isOverlay={false} isActive={true} />;
  }

  return (
    <>
      <MidContainer mode={midMode} resultData={props} handleSave={submitData} onPlaceAISelect={onCourseIndexSelect} />
    </>
  );
};

export default GuestMidFinding;
