import type { FinalPartyResult } from '../types/PartyResultTypes';

export const MOCK_PARTY_RESULT: FinalPartyResult = {
  isLeader: true,
  partyName: '안산팟 번개 모임',
  partyDate: '2025.11.10 오후 3시',
  midPointName: '경기도 부천시청역 인근',
  midPointLat: 37.5028, // 서울/경기권 중앙 임의 좌표
  midPointLng: 127.0294,
  placeData: null,

  courses: [
    {
      courseNo: 1,
      courseId: 100,
      courseType: '밥집',
      courseName: '000 쌈밥집',
      finalAddress: '경기도 이천시 부발읍 000길 12',
      externalLink: 'https://map.naver.com/...',
      hitMenu: '김치찌개',
      lat: 37.5,
      lng: 127.05,
    },
    {
      courseNo: 2,
      courseId: 200,
      courseType: '카페',
      courseName: '뚜섬플레이스',
      finalAddress: '경기도 수원시 영통구 000',
      externalLink: 'https://map.naver.com/...',
      hitMenu: '아인슈페너',
      lat: 37.51,
      lng: 127.04,
    },
    {
      courseNo: 3,
      courseId: 300,
      courseType: '쇼핑',
      courseName: '더현대 서울',
      finalAddress: '서울특별시 영등포구',
      externalLink: 'https://map.naver.com/...',
      hitMenu: ' ',
      lat: 37.52,
      lng: 127.03,
    },
  ],

  members: [
    {
      name: '홍길동',
      startAddress: '인천광역시 미추홀구',
      transportMode: 'PUBLIC',
      routeDetail: {
        totalTime: '1시간 10분',
        routeSummary: '4호선 2회 환승',
        startLat: 37.45,
        startLng: 126.68,
      },
    },
    {
      name: '김철수',
      startAddress: '경기도 성남시 분당구',
      transportMode: 'PRIVATE',
      routeDetail: {
        totalTime: '40분',
        routeSummary: '경부고속도로 이용',
        startLat: 37.38,
        startLng: 127.1,
      },
    },
    {
      name: '방장 (나)',
      startAddress: '경기도 부천시',
      transportMode: 'PUBLIC',
      routeDetail: {
        totalTime: '30분',
        routeSummary: '1호선 직통',
        startLat: 37.54,
        startLng: 126.89,
      },
    },
  ],
};
