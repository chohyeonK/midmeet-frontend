// 비회원 모임원 입력 페이지

import React, { useState } from 'react';
import Button from '../common/Button';
import AddGuest from '../Guest/AddGuest';
import { type MemberData, type TransportMode, INITIAL_MEMBERS } from '../../types/GuestTypes';

const StepFormGuest = () => {
  const [members, setMembers] = useState<MemberData[]>(INITIAL_MEMBERS);

  // 모임원 추가 핸들러
  const handleAddMember = () => {
    const newMember = {
      memberId: `uuid`,
      name: `모임원 ${members.length + 1}`,
      startAddr: '',
      transportMode: 'PUBLIC' as TransportMode,
    };

    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  // 모임원 수정 핸들러
  const handleEditMember = (id: string, field: keyof MemberData, value: string) => {
    setMembers((prevMember) => prevMember.map((member) => (member.memberId === id ? { ...member, [field]: value } : member)));
  };

  // 모임원 삭제 핸들러
  const handleDeleteMember = (id: string) => {
    if (members.length <= 2) {
      alert('최소 두 명의 모임원이 필요합니다.');
      return;
    }
    setMembers((prevMembers) => prevMembers.filter((member) => member.memberId !== id));
  };

  return (
    <div>
      <div>모임원 정보 입력하기</div>

      {/* 기본 2명 제공 */}
      {/* 모임원 정보 입력 컴포넌트 반복 */}
      {/* // 이름, 출발지, 교통수단 */}
      {members.map((member, index) => (
        <AddGuest key={member.memberId} member={member} index={index} onChange={handleEditMember} onDelete={handleDeleteMember} />
      ))}
      <Button buttonName='모임원 추가' onClick={handleAddMember} />
    </div>
  );
};

export default StepFormGuest;
