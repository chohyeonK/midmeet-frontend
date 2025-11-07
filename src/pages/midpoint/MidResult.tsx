import React from 'react';
import type { FinalPartyResult } from '../../types/PartyResultTypes';
import { MOCK_PARTY_RESULT } from '../../data/mockPartyResult'; // 목업 데이터 임포트
import MidContainer from '../../components/midpoint/MidContainer';
// MidContainerProps 타입 정의는 MidContainer.tsx에 있다고 가정

const MidResult: React.FC = () => {
  // 1. 목업 데이터를 FinalPartyResult 타입으로 가져옵니다.
  const partyResultData: FinalPartyResult = MOCK_PARTY_RESULT as FinalPartyResult;

  // ✅ 2. midContainerProps 변수에 값을 할당합니다.
  const midContainerProps = {
    mode: 'VIEW' as const,
    resultData: partyResultData, // ⬅️ 변수에 값을 할당 (에러 해결)

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
