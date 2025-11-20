import React, { useEffect, useState } from 'react';
// import type { FinalPartyResult } from '../../types/MidResultTypes';
// import { MOCK_PARTY_RESULT } from '../../data/mockPartyResult'; // 목업 데이터 임포트
import MidContainer from '../../components/midpoint/MidContainer';
import type { MidResultData } from '../../types/MidResultTypes';
import { MOCK_MID_RESULT_DATA } from '../../data/mockPartyResult';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// MidContainerProps 타입 정의는 MidContainer.tsx에 있다고 가정
const getTokenFromStorage = () => localStorage.getItem('token') || null;

const MidResult: React.FC = () => {
  const { partyId } = useParams();
  const token = getTokenFromStorage();
  // const partyResultData: MidResultData = MOCK_MID_RESULT_DATA as MidResultData;
  const [partyResultData, setPartyResultData] = useState<MidResultData | null>(null); // 초기값을 null로 설정

  const midContainerProps = {
    mode: 'VIEW' as const,
    resultData: partyResultData,

    // VIEW 모드이므로 handleNext, handlePrev 등은 제외하거나,
    // 필요하다면 공유 버튼 로직을 onShare 등의 이름으로 추가해야 합니다.
  };

  useEffect(() => {
    const fectchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/party/${partyId}/result`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        if (response.status === 200) {
          // setPartyList(response.data);
          const { party, course_list } = response.data;
          const { party_id, party_name, date_time } = party;

          const partyData: MidResultData = {
            party: {
              partyName: party_name,
              partyDate: date_time,
              midPoint: '가라 데이터',
              midPointLat: 37.497942,
              midPointLng: 127.027621,
              courses: [
                {
                  courseNo: 1,
                  places: {
                    placeId: 901,
                    placeName: '추천 맛집 A',
                    placeAddr: '강남구 역삼동 123-45',
                    lat: 37.4981,
                    lng: 127.0285,
                  },
                },
                {
                  courseNo: 2,
                  places: {
                    placeId: 901,
                    placeName: '추천 맛집 B',
                    placeAddr: '강남구 역삼동 123-45',
                    lat: 37.5100586,
                    lng: 127.0601188,
                  },
                },
                {
                  courseNo: 3,
                  places: {
                    placeId: 901,
                    placeName: '추천 맛집 C',
                    placeAddr: '강남구 역삼동 123-45',
                    lat: 37.5034605,
                    lng: 127.0278301,
                  },
                },
              ],
            },
            isLeader: true,
            members: [
              {
                name: '김모임(나)', // 리더 본인
                startAddr: '경기도 성남시 분당구 판교동',
                transportMode: 'PUBLIC',
                routeDetail: {
                  totalTime: '55분',
                  routeSummary: '신분당선 1회 환승',
                  startLat: 37.3942,
                  startLng: 127.1115,
                },
              },
              {
                name: '이친구',
                startAddr: '서울특별시 송파구 잠실동',
                transportMode: 'PRIVATE',
                routeDetail: {
                  totalTime: '40분',
                  routeSummary: '자가용 (경부고속도로)',
                  startLat: 37.5117,
                  startLng: 127.0858,
                },
              },
              {
                name: '박약속',
                startAddr: '서울특별시 영등포구 여의도동',
                transportMode: 'PUBLIC',
                routeDetail: {
                  totalTime: '1시간 10분',
                  routeSummary: '9호선 급행 1회 환승',
                  startLat: 37.5255,
                  startLng: 126.9248,
                },
              },
            ],
          };
          setPartyResultData(partyData);
        }
      } catch (error) {
        console.log(error);
        // setParty([]);
      } finally {
        // setIsLoading(false);
      }
    };

    fectchData();
  }, []);

  if (partyResultData === null) {
    // ⭐ 1. 로딩 중이거나 데이터가 null이면 로딩 화면 반환
    return <div>데이터 세팅중...</div>;
  }

  return (
    <>
      <MidContainer {...midContainerProps} />
    </>
  );
};

export default MidResult;
