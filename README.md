# 미드미트 (MidMeet) 프론트엔드

미드미트는 서로 다른 지역에서 출발하는 사람들이 모임 장소를 정할 수 있도록 돕는 웹 서비스입니다. 참가자의 출발지와 교통수단을 입력하면 예상 이동시간을 바탕으로 중간지점 후보를 추천합니다. 추천 지점 주변에서 식당이나 카페를 골라 모임 코스를 구성할 수 있습니다.

- **개발 기간** 6개월
- **팀 규모** 4명
- **개발 상태** 완료
- [백엔드 저장소](https://github.com/skand406/midmeet-backend)

## 주요 기능

- **모임 생성 및 참여** · 모임을 만들고 초대 링크로 참가합니다. 비회원도 참가자 정보를 입력해 중간지점과 코스 추천을 받을 수 있습니다.
- **출발지와 교통수단 입력** · 주소 검색으로 출발지를 선택하고, 대중교통 또는 자동차로 이동할지 입력합니다.
- **중간지점 지도 시각화** · 백엔드가 반환한 추천 지점을 지도에 표시하고, 선택한 코스 장소는 번호가 붙은 마커로 표시합니다.
- **주변 장소 추천 및 코스 구성** · 추천 목록에서 장소를 선택합니다. 직접 코스를 구성하는 모드에서는 선택한 장소를 기준으로 다음 코스의 후보를 불러옵니다.
- **결과 확인** · 확정된 코스와 참가자별 예상 이동시간 및 경로 상세를 확인합니다.

## 내 담당 범위

서비스 기획에 참여하고, 출발지와 교통수단 입력 화면, 중간지점 지도, 주변 장소 추천 및 모임 코스 구성 화면을 개발했습니다. REST API로 받은 중간지점과 장소 데이터를 지도 및 목록에 연결했습니다.

| 구현 내용 | 관련 코드 |
|---|---|
| 출발지와 교통수단을 입력받고 참여 API에 전송 | [`JoinInput.tsx`](https://github.com/chohyeonK/midmeet-frontend/blob/master/src/pages/party/JoinInput.tsx#L12-L48) |
| 중간지점과 선택한 코스 장소를 지도 마커 데이터로 구성 | [`MidContainer.tsx`](https://github.com/chohyeonK/midmeet-frontend/blob/master/src/components/midpoint/MidContainer.tsx#L149-L252) |
| 마커를 표시하고 모든 지점이 보이도록 지도 범위를 조정 | [`Map.tsx`](https://github.com/chohyeonK/midmeet-frontend/blob/master/src/components/midpoint/Map.tsx#L46-L84) |
| 선택한 장소의 좌표로 다음 코스의 후보를 조회 | [`MidFinding.tsx`](https://github.com/chohyeonK/midmeet-frontend/blob/master/src/pages/midpoint/MidFinding.tsx#L212-L252) |

## 중간지점 추천 방식

백엔드는 OpenTripPlanner(OTP)에서 각 참가자가 일정 시간 안에 도달할 수 있는 영역을 받아옵니다. 참가자들의 영역이 겹치는 곳에서 지하철역 후보를 찾고, 후보별로 참가자의 예상 이동시간을 비교합니다. 이동시간 표준편차가 가장 작은 역을 추천하고, 표준편차가 같으면 평균 이동시간이 더 짧은 역을 선택합니다. 프론트엔드는 추천 결과를 받아 지도와 장소 목록에 반영합니다. [백엔드 중간지점 계산 코드](https://github.com/skand406/midmeet-backend/blob/master/src/party/services/otp/otp.service.ts#L218-L344)

## 기술 스택

| 용도 | 기술 |
|---|---|
| UI 및 빌드 | React, TypeScript, Vite, Tailwind CSS |
| 페이지 이동 | React Router |
| 지도 | Leaflet, React Leaflet, OpenStreetMap |
| 상태 및 폼 | Zustand, React Hook Form, Yup |
| API 연동 | Axios |

## 로컬 실행

Node.js 22.12 이상과 npm이 필요합니다. 모임 생성, 참여, 중간지점 추천을 사용하려면 접속 가능한 미드미트 백엔드가 필요합니다. [Vite 7 실행 환경](https://v7.vite.dev/guide/)

```bash
git clone https://github.com/chohyeonK/midmeet-frontend.git
cd midmeet-frontend
npm ci
```

프로젝트 루트에 `.env.local` 파일을 만들고, `VITE_API_URL`에 사용 가능한 백엔드 API 주소를 지정합니다.

```dotenv
VITE_API_URL=백엔드_API_주소
```

```bash
npm run dev     # 개발 서버 실행
npm run build   # 타입 검사 및 프로덕션 빌드
npm run lint    # ESLint 검사
```

개발 서버가 출력하는 로컬 주소를 브라우저에서 엽니다.

## 주요 디렉터리

```text
src/
├── pages/
│   ├── party/        # 모임 생성과 초대 참여
│   ├── midpoint/     # 중간지점 추천, 코스 구성 및 결과
│   └── guest/        # 비회원 모임 흐름
├── components/
│   ├── forms/        # 입력 폼
│   └── midpoint/     # 지도, 장소 목록, 경로 상세
├── store/           # Zustand 스토어
└── types/           # 응답 데이터 및 화면 타입
```
