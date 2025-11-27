import React, { useEffect, useState } from 'react';
import StatusForm, { type StatusProps } from '../../components/forms/StatusForm';
import { useLocation } from 'react-router-dom';

const GuestMidStart: React.FC = () => {
  const [statusProps, setStatusProps] = useState<StatusProps | null>(null);
  const location = useLocation();

  useEffect(() => {
    let finalPartyResult = location.state?.partyResult;

    if (!finalPartyResult) {
      const storedData = sessionStorage.getItem('partyCreationResult');
      if (storedData) {
        finalPartyResult = JSON.parse(storedData);
      }
    }

    if (finalPartyResult) {
      const { party } = finalPartyResult;

      setStatusProps({
        topTitle: party.partyName || '모임 정보 없음',
        title: '모임이 생성되었습니다!',
        message: '지금 바로 시작해보세요!',
        buttonText: '시작',
        linkTo: {
          pathname: '/guest/finding',
        },
      });
    } else {
      console.error('모임 데이터를 찾을 수 없습니다.');
    }
  }, [location.state]);
  if (!statusProps) {
    return <div>모임 데이터를 불러오는 중이거나 찾을 수 없습니다.</div>;
  }

  return <StatusForm {...statusProps} />;
};

export default GuestMidStart;
