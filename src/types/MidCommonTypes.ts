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

// 지도 좌표
export interface Point {
  lat: number; // 위도
  lng: number; // 경도
  name: string; // 장소 이름 (팝업용)
  type: 'midpoint' | 'selected';
}
