import type { RecommendedPlace } from './MidFindTypes';

// 중간지점 도출/결과 분기
export type ViewMode = 'FIND' | 'VIEW';

// 전체 코스 보기 시 사용
export interface PartyCourse {
  courseNo: number;
  places: RecommendedPlace;
}

export interface PartyData {
  partyName: string;
  partyDate: string;
  midPoint: string;
  midPointLat: number;
  midPointLng: number;
  courses: PartyCourse[];
}
