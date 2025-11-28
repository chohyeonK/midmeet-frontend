import React, { useCallback, useEffect, useState } from 'react';
// import type { FinalPartyResult } from '../../types/MidResultTypes';
// import { MOCK_PARTY_RESULT } from '../../data/mockPartyResult'; // 목업 데이터 임포트
import MidContainer from '../../components/midpoint/MidContainer';
import type { MidResultData } from '../../types/MidResultTypes';
import { MOCK_MID_RESULT_DATA } from '../../data/mockPartyResult';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import type { RecommendedPlace } from '../../types/MidFindTypes';
// MidContainerProps 타입 정의는 MidContainer.tsx에 있다고 가정
const getTokenFromStorage = () => localStorage.getItem('token') || null;

const MidResult: React.FC = () => {
  const { partyId } = useParams();
  const token = getTokenFromStorage();
  const [isLoading, setIsLoading] = useState(true);
  // const partyResultData: MidResultData = MOCK_MID_RESULT_DATA as MidResultData;
  const [partyResultData, setPartyResultData] = useState<MidResultData | null>(null); // 초기값을 null로 설정

  // 4. 장소 선택/상세 보기 핸들러 (useCallback 사용) - 변경 없음
  const onPlaceSelect = (url: string) => {
    console.log('클릭함, 링크 나와야함');
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      // 팝업 차단 메시지 처리 (console 대신 사용자에게 보이는 메시지 박스 사용 권장)
      console.error('팝업 차단으로 인해 새 탭을 열 수 없습니다.');
    }
  };

  useEffect(() => {
    const fectchData = async () => {
      if (!token || !partyId) {
        setIsLoading(false);
        return;
      }
      try {
        // 토큰이나 partyId가 없으면 API 호출을 막고 로딩을 종료합니다.
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/party/${partyId}/result`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response);

        if (response.status === 200) {
          // setPartyList(response.data);
          // console.log('백엔드 데이터: ', response.data);

          const { party, member, role } = response.data;
          const partyData: MidResultData = {
            party: {
              partyName: party.partyName,
              partyDate: party.partyDate,
              midPoint: party.midPoint,
              midPointLat: party.midPointLat,
              midPointLng: party.midPointLng,
              courses: party.courses,
            },
            isLeader: role === 'LEADER' ? true : false,
            members: member,
          };

          setPartyResultData(partyData);
        }
      } catch (error) {
        // console.log(error);
        alert('시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        // setParty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fectchData();
  }, []);

  const midContainerProps = {
    mode: 'VIEW' as const,
    resultData: partyResultData,
  };

  if (isLoading || partyResultData === null) {
    return <LoadingOverlay isOverlay={true} isActive={true} />;
  }

  return (
    <>
      <MidContainer {...midContainerProps} />
    </>
  );
};

export default MidResult;
