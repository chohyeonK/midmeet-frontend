import React, { useEffect, useState } from 'react';
import MidContainer from '../../components/midpoint/MidContainer';
import type { MidResultData } from '../../types/MidResultTypes';

const GuestMidResult: React.FC = () => {
  const [partyResultData, setPartyResultData] = useState<MidResultData | null>(null); // 초기값을 null로 설정

  const getData = () => {
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
  };

  useEffect(() => {
    getData();
  }, []);

  const midContainerProps = {
    mode: 'VIEW' as const,
    resultData: partyResultData,
  };

  if (partyResultData === null) {
    return <div>데이터 세팅중...</div>;
  }

  return (
    <>
      <MidContainer {...midContainerProps} />
    </>
  );
};

export default GuestMidResult;
