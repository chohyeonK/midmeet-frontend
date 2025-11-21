import type { PartyCourse, PartyData } from './MidCommonTypes';

// 추천 방식
export type CourseMode = 'CUSTOM_COURSE' | 'AI_COURSE';

// 장소 관련(사용자 지정, AI 추천에서 사용)
export interface RecommendedPlace {
  placeId?: number;
  placeName: string;
  placeAddr: string;
  lat: number;
  lng: number;
  hitMenu?: string;
  review?: string;
  link?: string;
}

// AI 추천 장소
export interface AIRecommendPlace {
  courseId: string;
  courseNo: number;
  courseName: string;
  places: RecommendedPlace[];
}

// 중간 지점 찾기 총 데이터
export interface MidFindData {
  party: PartyData;
  courseMode: CourseMode;
  customRecommendList: RecommendedPlace[] | null;
  aiRecommendList: AIRecommendPlace[] | null;
  currentCourseIndex: number;
  placeData: RecommendedPlace | null; // 현재 선택된 상세 정보
}
