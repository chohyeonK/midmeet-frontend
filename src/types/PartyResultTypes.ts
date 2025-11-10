// 1. 코스별 확정된 장소 정보
export interface FinalCourse {
  courseNo: number; // 1, 2, 3 순번
  courseId: number; // 고유 id
  courseName: string; // 최종 선택된 장소 이름
  courseType: string; // '밥집', '카페' 등 코스 목적
  finalAddress: string; // 최종 확정 주소
  externalLink: string; // 보기 버튼에 연결될 외부 지도 링크
  hitMenu: string;
  lat: number; // 최종 장소의 위도
  lng: number; // 최종 장소의 경도
}

// 2. 모임원별 이동 정보 (결과 페이지 핵심 데이터)
export interface MemberRouteInfo {
  name: string; // 참여자 이름
  startAddress: string; // 출발지 주소
  transportMode: 'PUBLIC' | 'PRIVATE'; // 교통 수단

  // 길찾기 상세 정보
  routeDetail: {
    totalTime: string; // 총 소요 시간 (예: '1시간 10분')
    routeSummary: string; // 경로 요약 (예: '4호선 2회 환승)
    startLat: number; // 출발지 좌표
    startLng: number; // 출발지 좌표
  };
}

// 3. 최종 API 응답 데이터 (프론트엔드에서 받을 전체 데이터)
export interface FinalPartyResult {
  isLeader: boolean; // 현재 로그인 유저의 방장 여부
  partyName: string;
  partyDate: string;
  midPointName: string; // 중간 지점 이름
  midPointLat: number; // 중간 지점 위도 (지도 중심용)
  midPointLng: number; // 중간 지점 경도 (지도 중심용)
  courses: FinalCourse[]; // 확정된 코스 목록
  members: MemberRouteInfo[]; // 모임원별 경로 정보
  placeData: CourseSummary | null;
}

// ✅ Pick을 사용하여 courseNo와 courseName만 추출
export type CourseSummary = Pick<FinalCourse, 'courseNo' | 'courseName' | 'courseId' | 'finalAddress' | 'hitMenu'>;
