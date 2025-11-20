export const FILTER_CATEGORIES = {
  // 1. 음식점 (FD6)
  FD6: {
    label: '음식점',
    icon: '🍽️',
    subGroups: [
      {
        groupName: '음식 종류',
        multiSelect: true, // 중복 선택 허용 (API 다중 호출용)
        // 아예 체크 안 하면 'query'를 비워서 모든 음식점을 검색하도록 처리 (백엔드/클라이언트 로직)
        tags: [
          { name: '한식', query: '한식' },
          { name: '양식', query: '양식' },
          { name: '일식', query: '일식' },
          { name: '중식', query: '중식' },
        ],
      },
      {
        groupName: '특징/편의',
        multiSelect: true, // 2차 자체 필터링용으로 다중 선택 허용
        // filterKey는 2차 자체 필터링 함수가 사용할 키워드입니다.
        tags: [
          { name: '가성비', filterKey: '가성비' },
          { name: '모던한', filterKey: '모던한' },
          { name: '주차가능', filterKey: '주차' },
          { name: '단체석', filterKey: '단체' },
        ],
      },
    ],
  },

  // 2. 카페 (CE7)
  CE7: {
    label: '카페',
    icon: '☕',
    subGroups: [
      {
        groupName: '분위기/목적',
        multiSelect: true,
        tags: [
          { name: '작업하기좋은', query: '스터디' }, // API 쿼리용은 대표 키워드를 사용
          { name: '디저트맛집', query: '디저트' },
          { name: '뷰맛집', query: '루프탑' },
          { name: '조용한', query: '조용한' },
        ],
      },
      {
        groupName: '편의 시설',
        multiSelect: true,
        tags: [
          { name: '콘센트', filterKey: '콘센트' },
          { name: '주차가능', filterKey: '주차' },
          { name: '반려동물', filterKey: '반려동물' },
        ],
      },
    ],
  },

  // 3. 놀거리/문화
  CT1: {
    label: '놀거리/문화',
    icon: '🎡',
    // 놀거리는 API 코드가 불명확하므로, 1차 쿼리로 직접 장소 종류를 검색합니다.
    subGroups: [
      {
        groupName: '장소 종류',
        multiSelect: false, // 이 그룹은 1개만 선택하도록 제한하는 것이 검색에 유리
        tags: [
          { name: '방탈출', query: '방탈출' },
          { name: '보드게임', query: '보드게임' },
          { name: '영화관', query: '영화관' },
          { name: '전시/미술', query: '전시' },
        ],
      },
      {
        groupName: '특징/편의',
        multiSelect: true,
        tags: [
          { name: '실내', filterKey: '실내' },
          { name: '인기장소', filterKey: '인기' },
          { name: '쉬운접근', filterKey: '역근처' },
        ],
      },
    ],
  },
};
