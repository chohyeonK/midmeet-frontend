import type { Course } from '../pages/party/Create';

export type TransportMode = 'PUBLIC' | 'PRIVATE';

export interface MemberData {
  memberId: string;
  name: string;
  startAddr: string;
  transportMode: TransportMode;
}

export interface GuestPartyFormData {
  name: string;
  date: Date | null;
  numberOfPeople: number;
  members: MemberData[];
  courseList: Course[];
}

// 초기 모임원 데이터
const createInitialMember = (index: number, isOrganizer: boolean): MemberData => ({
  // UUID 대신 임시로 현재 시간을 활용하여 고유 ID 생성
  memberId: `member-${Date.now()}-${index}`,
  name: isOrganizer ? '모임장' : `모임원 ${index}`,
  startAddr: '',
  transportMode: 'PUBLIC',
});

// 초기 상태: 2명의 모임원 (모임장 본인 포함)
export const INITIAL_MEMBERS: MemberData[] = [createInitialMember(1, true), createInitialMember(2, false)];

export interface GuestAdd {
  index: number;
  member: MemberData;
  onChange: (id: string, field: keyof MemberData, value: string | TransportMode) => void;
  onDelete: (id: string) => void;
}
