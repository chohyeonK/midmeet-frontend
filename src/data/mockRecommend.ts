import type { RecommendedPlace, PartyData, AiRecommendPlace } from '../types/MidFindTypes';

export const foodList: RecommendedPlace[] = [
  {
    placeId: 1,
    placeName: '000 고깃집',
    address: '경기도 안산시',
    hitMenu: '차돌 볶음',
    review: '정말 맛있어용!!',
  },
  {
    placeId: 2,
    placeName: '00 김밥천국',
    address: '경기도 부천시',
    hitMenu: '참치땡초김밥',
    review: '정말 김밥이 끝내주네용!!',
  },
  {
    placeId: 3,
    placeName: '000 파스타',
    address: '경기도 과천시',
    hitMenu: '쉬림프 로제 파스타',
    review: '파스타가 굉장히 맛있어요.',
  },
  {
    placeId: 4,
    placeName: '000 쌈밥집',
    address: '경기도 이천시',
    hitMenu: '우렁 쌈밥',
    review: '쌈밥하면 이집입니다!',
  },
  {
    placeId: 5,
    placeName: '프레디의 피자가게',
    address: '경기도 수원시',
    hitMenu: '오리지널 피자',
    review: '피자를 사면 곰이 와요..',
  },
];

export const cafeList: RecommendedPlace[] = [
  {
    placeId: 1,
    placeName: '투썸플레이스',
    address: '경기도 수원시',
    hitMenu: '말차라떼',
    review: '아이스박스 보다 꿀맛',
  },
  {
    placeId: 1,
    placeName: '스타벅스',
    address: '경기도 안산시',
    hitMenu: '콘파냐',
    review: '쌉싸름해용',
  },
  {
    placeId: 1,
    placeName: '이디야',
    address: '경기도 수원시',
    hitMenu: '수박주스',
    review: '생으로 갈은 수박이라 꿀맛!!',
  },
];

export const shoppingList: RecommendedPlace[] = [
  {
    placeId: 10,
    placeName: '스타필드 코엑스',
    address: '서울특별시 강남구',
    hitMenu: '영풍문고, 카카오프렌즈',
    review: '하루종일 놀기 좋아요.',
  },
  {
    placeId: 11,
    placeName: '더현대 서울',
    address: '서울특별시 영등포구',
    hitMenu: '층별 팝업 스토어',
    review: '트렌디한 장소!',
  },
];

export const AI_RECOMMENDATION_OPTIONS: AiRecommendPlace[] = [
  // --- 추천 코스 1 ---
  {
    courseId: 'ai-c-001',
    title: '추천 코스 1',
    places: [
      { placeId: 1, placeName: '마포 생갈비', address: '서울 마포구 상수동 123', hitMenu: '한우 생갈비', review: '한우 생갈비가 정말 맛있음!' },
      { placeId: 2, placeName: '이디야 커피', address: '서울 마포구 와우산로 45', hitMenu: '수박 쥬스', review: '생 수박을 갈아서 정말 맛있어요~' },
      { placeId: 3, placeName: 'CGV 영화관', address: '서울 마포구 양화로 100', hitMenu: ' ', review: '리클라이너 좌석이라 편해요!' },
    ],
  },

  // --- 추천 코스 2 ---
  {
    courseId: 'ai-c-002',
    title: '추천 코스 2',
    places: [
      { placeId: 1, placeName: '아웃백 스테이크', address: '경기 성남시 분당구 12', hitMenu: '투움바 파스타', review: '이 지점이 제일 맛있음!!' },
      { placeId: 2, placeName: '투썸플레이스', address: '경기 성남시 판교역로 34', hitMenu: '말차라떼', review: '좌석이 많아요' },
      { placeId: 3, placeName: '롯데백화점', address: '경기 성남시 동판교로 56', hitMenu: ' ', review: ' ' },
    ],
  },

  // --- 추천 코스 3 ---
  {
    courseId: 'ai-c-003',
    title: '추천 코스 3',
    places: [
      { placeId: 1, placeName: '역전우동', address: '서울 강남구 역삼로 10', hitMenu: '불고기 덮밥', review: '싸고 맛있음' },
      { placeId: 2, placeName: '컴포즈 커피', address: '서울 강남구 테헤란로 20', hitMenu: '아인슈페너', review: '아인슈페너 꿀맛' },
      { placeId: 3, placeName: '신세계 백화점', address: '서울 강남구 압구정로 30', hitMenu: ' ', review: ' ' },
    ],
  },
];

export const initialPartyData: PartyData = {
  partyName: '안산팟',
  partyDate: '2025.11.10 오후 3시',
  midPoint: '경기도 부천시',
  courseType: 'CUSTOM_COURSE',
  currentCourseIndex: 0,
  recommendList: null,
  aiRecommendList: null,
  placeData: null,
  courseList: [
    { courseNo: 1, courseName: '미지정', courseId: 400, selectedPlace: null },
    { courseNo: 2, courseName: '미지정', courseId: 500, selectedPlace: null },
    { courseNo: 3, courseName: '미지정', courseId: 600, selectedPlace: null },
  ],
};
