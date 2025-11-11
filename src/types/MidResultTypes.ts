import type { PartyData } from './MidCommonTypes';

// 모임원별 이동 정보 (결과 페이지 핵심 데이터)
export interface MemberRouteInfo {
  name: string; // 참여자 이름
  startAddr: string; // 출발지 주소
  transportMode: 'PUBLIC' | 'PRIVATE'; // 교통 수단

  // 길찾기 상세 정보
  routeDetail: {
    totalTime: string; // 총 소요 시간 (예: '1시간 10분')
    routeSummary: string; // 경로 요약 (예: '4호선 2회 환승)
    startLat: number; // 출발지 좌표
    startLng: number; // 출발지 좌표
  };
}

// 중간 지점 결과 총 데이터
export interface MidResultData {
  party: PartyData;
  isLeader: boolean;
  members: MemberRouteInfo[];
}
