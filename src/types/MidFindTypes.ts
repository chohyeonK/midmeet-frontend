// 데이터 정의
// interface RecommendedPlace {
//     placeId: string;
//     placeName: string;
//     address: string;
//     lat: number;      // 필수: 지오코딩된 위도
//     lng: number;      // 필수: 지오코딩된 경도
//     hitMenu: string;  // 부가 정보
//     review: string;   // 부가 정보
// }

// // 2. 코스 객체 (CourseList 배열에 들어가는 형태)
// interface PartyCourse {
//     courseNo: number;       // 1, 2, 3 순번
//     tag: string;            // '음식점', '카페' (목적)
//     // ✅ 사용자가 최종 선택한 장소 정보를 여기에 저장합니다.
//     selectedPlace: RecommendedPlace | null;
// }

// // 3. 모임 전체 데이터 (최종 상태)
// interface PartyData {
//     partyName: string;
//     partyDate: Date | null;
//     midPoint: string; // 중간 지점 이름 (예: '선릉역')
//     courseList: PartyCourse[]; // 코스 목록 배열
// }

export interface RecommendedPlace {
  placeId: number;
  placeName: string;
  address: string;
  hitMenu?: string;
  review?: string;
}

// 전체 코스 보기 시 사용
export interface PartyCourse {
  courseNo: number;
  courseName: string;
  courseId: number; // 고유 id
  selectedPlace: RecommendedPlace | null;
  // lat: number; // 최종 장소의 위도
  // lng: number; // 최종 장소의 경도
}

export type CourseMode = 'CUSTOM_COURSE' | 'AI_COURSE';

export interface AiRecommendPlace {
  courseId: string; // 이 코스 묶음의 고유 ID
  title: string; // 예: "추천 코스 1"
  places: RecommendedPlace[];
}

export interface PartyData {
  partyName: string;
  partyDate: string;
  midPoint: string;
  courseList: PartyCourse[];
  currentCourseIndex: number;
  recommendList: RecommendedPlace[] | null;
  aiRecommendList: AiRecommendPlace[] | null;
  placeData: RecommendedPlace | null;
  courseType: CourseMode;
}
