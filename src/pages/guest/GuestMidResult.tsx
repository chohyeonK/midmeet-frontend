import React, { useEffect, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import type { MidResultData } from '../../types/MidResultTypes';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const GuestMidResult: React.FC = () => {
  const [partyResultData, setPartyResultData] = useState<MidResultData | null>(null); // 초기값을 null로 설정
  const [isLoading, setIsLoading] = useState(true);

  const getData = () => {
    setIsLoading(true);
    const storedData = sessionStorage.getItem('result');

    if (storedData) {
      const parseData = JSON.parse(storedData);
      console.log(parseData);

      const { party, member } = parseData;

      const partyData: MidResultData = {
        party: {
          partyName: party.partyName,
          partyDate: party.partyDate,
          midPoint: party.midPoint,
          midPointLat: party.midPointLat,
          midPointLng: party.midPointLng,
          courses: party.courses,
        },
        isLeader: true, // 비회원은 모임장만 볼 수 있음
        members: member,
      };
      setPartyResultData(partyData);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
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

export default GuestMidResult;
