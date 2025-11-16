import type { AIRecommendPlace, MidFindData, RecommendedPlace } from '../types/MidFindTypes';

// MidFindTypes.ts의 MidFindData 구조에 맞춘 초기 상태 목업
export const MOCK_MID_FIND_INITIAL_DATA: MidFindData = {
  // 1. party: PartyData (초기 미팅 정보)
  party: {
    partyName: '서울 강남 모임',
    partyDate: '2025.11.30 오후 6시',
    midPoint: '서울특별시 강남구 신논현역',
    midPointLat: 37.5048,
    midPointLng: 127.0245,
    courses: [
      // 코스 목록 (예: 1차 식사, 2차 카페)
      {
        courseNo: 1,
        places: {
          // MidCommonTypes의 PartyCourse 구조에 따름
          placeId: 900,
          placeName: '미정',
          placeAddr: '미정',
          lat: 0,
          lng: 0,
        },
      },
      {
        courseNo: 1,
        places: {
          // MidCommonTypes의 PartyCourse 구조에 따름
          placeId: 900,
          placeName: '미정',
          placeAddr: '미정',
          lat: 0,
          lng: 0,
        },
      },
      {
        courseNo: 1,
        places: {
          // MidCommonTypes의 PartyCourse 구조에 따름
          placeId: 900,
          placeName: '미정',
          placeAddr: '미정',
          lat: 0,
          lng: 0,
        },
      },
    ],
  },

  // 2. courseMode: CourseMode
  // courseMode: 'CUSTOM_COURSE', // 기본 모드 설정
  courseMode: 'AI_COURSE', // 기본 모드 설정

  // 3. customRecommendList: RecommendedPlace[] | null
  customRecommendList: null, // 초기값: null

  // 4. aiRecommendList: AIRecommendPlace[] | null
  aiRecommendList: null, // 초기값: null

  // 5. currentCourseIndex: number (코스 배열의 인덱스)
  currentCourseIndex: 0,

  // 6. placeData: RecommendedPlace | null (현재 선택된 상세 정보)
  placeData: null, // 초기값: null
};

export const MOCK_FOOD_LIST: RecommendedPlace[] = [
  {
    placeId: 701,
    placeName: '시그니처 스테이크 하우스',
    placeAddr: '서울시 강남구 테헤란로 (음식 1)',
    lat: 37.5091,
    lng: 127.0558,
    hitMenu: '안심 스테이크',
    review: '데이트 장소로 완벽합니다.',
  },
  {
    placeId: 702,
    placeName: '분위기 좋은 한정식',
    placeAddr: '서울시 서초구 강남대로 (음식 2)',
    lat: 37.502,
    lng: 127.025,
    hitMenu: '궁중 갈비찜',
  },
  {
    placeId: 703,
    placeName: '인기 많은 이탈리안 비스트로',
    placeAddr: '서울시 강남구 역삼동 (음식 3)',
    lat: 37.4981,
    lng: 127.0285,
    hitMenu: '봉골레 파스타',
    link: 'https://food.example.com/bistro',
  },
];

export const MOCK_CAFE_LIST: RecommendedPlace[] = [
  {
    placeId: 801,
    placeName: '루프탑 전망 좋은 카페',
    placeAddr: '서울시 강남구 논현동 (카페 1)',
    lat: 37.5055,
    lng: 127.04,
    hitMenu: '아인슈페너',
    review: '야경이 정말 아름다워요.',
  },
  {
    placeId: 802,
    placeName: '조용한 북카페',
    placeAddr: '서울시 서초구 서초동 (카페 2)',
    lat: 37.511,
    lng: 127.0505,
    hitMenu: '수제 밀크티',
  },
  {
    placeId: 803,
    placeName: '감성 가득한 디저트 전문점',
    placeAddr: '서울시 강남구 신사동 (카페 3)',
    lat: 37.518,
    lng: 127.025,
    hitMenu: '딸기 케이크',
    link: 'https://cafe.example.com/dessert',
  },
];

export const MOCK_SHOPPING_LIST: RecommendedPlace[] = [
  {
    placeId: 901,
    placeName: '유니크한 의류 편집샵',
    placeAddr: '서울시 강남구 압구정로 (쇼핑 1)',
    lat: 37.5255,
    lng: 127.035,
    review: '희귀한 디자이너 상품이 많습니다.',
  },
  {
    placeId: 902,
    placeName: '대형 라이프스타일 스토어',
    placeAddr: '서울시 강남구 도산대로 (쇼핑 2)',
    lat: 37.521,
    lng: 127.0415,
    hitMenu: '향초 및 방향제',
  },
  {
    placeId: 903,
    placeName: '액세서리 전문점',
    placeAddr: '서울시 강남구 청담동 (쇼핑 3)',
    lat: 37.528,
    lng: 127.045,
  },
];

// AI 추천 코스 목록 (1차: 식사, 2차: 카페)
export const MOCK_AI_RECOMMEND_LIST: AIRecommendPlace[] = [
  // 🎯 첫 번째 코스 (1차: 식사)에 대한 AI 추천 목록
  {
    courseId: 'AI_C_001',
    courseNo: 1,
    courseName: '저녁 식사 추천',
    places: [
      {
        placeId: 101,
        placeName: 'AI 추천 한정식',
        placeAddr: '강남역 부근 1',
        lat: 37.506,
        lng: 127.026,
        hitMenu: '갈비찜',
      },
      {
        placeId: 102,
        placeName: 'AI 추천 이탈리안',
        placeAddr: '강남역 부근 2',
        lat: 37.5055,
        lng: 127.027,
        review: '데이트 명소',
      },
      {
        placeId: 103,
        placeName: '별마당 도서관',
        placeAddr: '강남역 부근 3',
        lat: 37.5100586,
        lng: 127.0601188,
        review: '자리 짱많아요',
      },
    ],
  },

  // 🎯 두 번째 코스 (2차: 카페)에 대한 AI 추천 목록
  {
    courseId: 'AI_C_002',
    courseNo: 2,
    courseName: '디저트 카페 추천',
    places: [
      {
        placeId: 103,
        placeName: 'AI 추천 루프탑 카페',
        placeAddr: '신논현역 부근 3',
        lat: 37.503,
        lng: 127.025,
        hitMenu: '아메리카노',
      },
      {
        placeId: 104,
        placeName: 'AI 추천 베이커리',
        placeAddr: '신논현역 부근 4',
        lat: 37.5045,
        lng: 127.0235,
      },
      {
        placeId: 105,
        placeName: '더 스머프 매직 포레스트 강남점',
        placeAddr: '신논현역 부근 3',
        lat: 37.5034605,
        lng: 127.0278301,
      },
    ],
  },
];
