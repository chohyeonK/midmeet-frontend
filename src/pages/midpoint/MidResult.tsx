import React from 'react';
// import type { FinalPartyResult } from '../../types/MidResultTypes';
// import { MOCK_PARTY_RESULT } from '../../data/mockPartyResult'; // 목업 데이터 임포트
import MidContainer from '../../components/midpoint/MidContainer';
import type { MidResultData } from '../../types/MidResultTypes';
import { MOCK_MID_RESULT_DATA } from '../../data/mockPartyResult';
// MidContainerProps 타입 정의는 MidContainer.tsx에 있다고 가정

const MidResult: React.FC = () => {
  const partyResultData: MidResultData = MOCK_MID_RESULT_DATA as MidResultData;

  const midContainerProps = {
    mode: 'VIEW' as const,
    resultData: partyResultData,

    // VIEW 모드이므로 handleNext, handlePrev 등은 제외하거나,
    // 필요하다면 공유 버튼 로직을 onShare 등의 이름으로 추가해야 합니다.
  };

  return (
    <>
      <MidContainer {...midContainerProps} />
    </>
  );
};

export default MidResult;
