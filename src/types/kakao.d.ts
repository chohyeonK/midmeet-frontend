// Kakao 지도 SDK 객체가 전역 window 객체에 존재함을 선언합니다.
declare global {
  interface Window {
    kakao: any; // 간단하게 any로 정의합니다.
  }
}

// 이 파일을 모듈로 인식시키기 위해 빈 export를 추가합니다.
export {};
