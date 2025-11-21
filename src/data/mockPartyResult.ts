import type { PartyData } from '../types/MidCommonTypes';
import type { MidResultData } from '../types/MidResultTypes';

export const MOCK_MID_RESULT_DATA: MidResultData = {
  party: {
    partyName: '강남 크리스마스 모임',
    partyDate: '2025.12.25 오후 7시',
    midPoint: '서울특별시 강남구 강남역 11번 출구',
    midPointLat: 37.497942,
    midPointLng: 127.027621,
    courses: [
      {
        courseId: 901,
        courseNo: 1,
        places: {
          placeId: 901,
          placeName: '추천 맛집 A',
          placeAddr: '강남구 역삼동 123-45',
          lat: 37.4981,
          lng: 127.0285,
        },
      },
      {
        courseId: 902,
        courseNo: 2,
        places: {
          placeId: 901,
          placeName: '추천 맛집 B',
          placeAddr: '강남구 역삼동 123-45',
          lat: 37.5100586,
          lng: 127.0601188,
        },
      },
      {
        courseId: 903,
        courseNo: 3,
        places: {
          placeId: 901,
          placeName: '추천 맛집 C',
          placeAddr: '강남구 역삼동 123-45',
          lat: 37.5034605,
          lng: 127.0278301,
        },
      },
    ],
  },

  // 2. isLeader: boolean
  isLeader: true, // 현재 사용자가 모임 리더라고 가정

  // 3. members: MemberRouteInfo[] (모임원별 이동 정보)
  members: [
    {
      name: '김모임(나)', // 리더 본인
      startAddr: '경기도 성남시 분당구 판교동',
      transportMode: 'PUBLIC',
      routeDetail: {
        totalTime: '55분',
        routeSummary: '신분당선 1회 환승',
        startLat: 37.3942,
        startLng: 127.1115,
      },
    },
    {
      name: '이친구',
      startAddr: '서울특별시 송파구 잠실동',
      transportMode: 'PRIVATE',
      routeDetail: {
        totalTime: '40분',
        routeSummary: '자가용 (경부고속도로)',
        startLat: 37.5117,
        startLng: 127.0858,
      },
    },
    {
      name: '박약속',
      startAddr: '서울특별시 영등포구 여의도동',
      transportMode: 'PUBLIC',
      routeDetail: {
        totalTime: '1시간 10분',
        routeSummary: '9호선 급행 1회 환승',
        startLat: 37.5255,
        startLng: 126.9248,
      },
    },
  ],
};

export const MOCK_MID_EDIT_DATA: PartyData = {
  partyName: '강남 크리스마스 모임',
  partyDate: '2025.12.25 오후 7시',
  midPoint: '서울특별시 강남구 강남역 11번 출구',
  midPointLat: 37.497942,
  midPointLng: 127.027621,
  courses: [
    {
      courseNo: 1,
      courseId: 901,
      places: {
        placeId: 901,
        placeName: '추천 맛집 A',
        placeAddr: '강남구 역삼동 123-45',
        lat: 37.4981,
        lng: 127.0285,
      },
    },
    {
      courseNo: 2,
      courseId: 902,
      places: {
        placeId: 901,
        placeName: '추천 맛집 B',
        placeAddr: '강남구 역삼동 123-45',
        lat: 37.5100586,
        lng: 127.0601188,
      },
    },
    {
      courseId: 903,
      courseNo: 3,
      places: {
        placeId: 901,
        placeName: '추천 맛집 C',
        placeAddr: '강남구 역삼동 123-45',
        lat: 37.5034605,
        lng: 127.0278301,
      },
    },
  ],
};
