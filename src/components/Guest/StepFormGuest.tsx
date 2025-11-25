import React, { useEffect } from 'react';
import Button from '../common/Button';
import AddGuest from '../Guest/AddGuest';
import { type GuestPartyFormData, type MemberData, type TransportMode } from '../../types/GuestTypes';

interface StepFormProps {
  data: GuestPartyFormData;
  onUpdateFormData: (data: Partial<GuestPartyFormData>) => void;
}

const StepFormGuest: React.FC<StepFormProps> = ({ data, onUpdateFormData }) => {
  // 1. 로컬 state (useState) 제거함 -> data.members를 직접 사용

  // 2. 초기화 로직: 진입 시 멤버 리스트가 비어있거나 개수가 안 맞으면 초기 세팅
  useEffect(() => {
    // 이미 멤버가 설정되어 있다면(뒤로가기 했다가 다시 온 경우 등) 초기화 하지 않음
    if (data.members.length > 0) return;

    // 첫 페이지에서 설정한 인원수(numberOfPeople)만큼 초기 리스트 생성
    const initialMembers = Array.from({ length: data.numberOfPeople }).map((_, index) => ({
      memberId: crypto.randomUUID(), // 또는 Date.now() + index 등 고유 ID
      // name: `모임원 ${index + 1}`,
      name: '',
      startAddr: '',
      transportMode: 'PUBLIC' as TransportMode,
    }));

    // 부모 데이터 업데이트
    onUpdateFormData({ members: initialMembers });
  }, []); // 의존성 배열 비워서 마운트 시 1회만 실행 (또는 필요에 따라 조절)

  // 3. 모임원 추가 핸들러
  const handleAddMember = () => {
    const newMember: MemberData = {
      memberId: crypto.randomUUID(),
      name: '',
      startAddr: '',
      transportMode: 'PUBLIC',
    };

    const newMembers = [...data.members, newMember];

    // 멤버 리스트와 인원수(numberOfPeople)를 동시에 업데이트
    onUpdateFormData({
      members: newMembers,
      numberOfPeople: newMembers.length,
    });
  };

  // 4. 모임원 수정 핸들러
  const handleEditMember = (id: string, field: keyof MemberData, value: string) => {
    const newMembers = data.members.map((member) => (member.memberId === id ? { ...member, [field]: value } : member));
    console.log('데이터 수정중', newMembers);
    onUpdateFormData({ members: newMembers });
  };

  // 5. 모임원 삭제 핸들러
  const handleDeleteMember = (id: string) => {
    if (data.members.length <= 2) {
      alert('최소 두 명의 모임원이 필요합니다.');
      return;
    }

    const newMembers = data.members.filter((member) => member.memberId !== id);

    // 멤버 리스트와 인원수(numberOfPeople)를 동시에 업데이트
    onUpdateFormData({
      members: newMembers,
      numberOfPeople: newMembers.length,
    });
  };

  return (
    <div>
      <div>모임원 정보 입력하기</div>
      <div className='mb-4 text-sm text-gray-500'>총 {data.numberOfPeople}명의 정보를 입력해주세요.</div>

      {/* data.members를 직접 매핑 */}
      {data.members.map((member, index) => (
        <AddGuest key={member.memberId} member={member} index={index} onChange={handleEditMember} onDelete={handleDeleteMember} />
      ))}

      <Button buttonName='모임원 추가' onClick={handleAddMember} />
    </div>
  );
};

export default StepFormGuest;
