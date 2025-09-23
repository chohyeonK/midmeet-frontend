import { create } from 'zustand';

// 사용자 데이터의 타입을 정의합니다.
// 서버 응답과 일치해야 합니다.
interface User {
  uid: string;
  id: string;
  email: string;
  name: string;
  phone: string;
}

// 인증 상태의 타입을 정의합니다.
interface AuthState {
  isLoggedIn: boolean; // 로그인 여부
  user: User | null; // 사용자 정보
  token: string | null; // JWT 토큰
  login: (user: User, token: string) => void; // 로그인 액션
  logout: () => void; // 로그아웃 액션
}

// Zustant 스토어를 생성합니다.
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,

  // 로그인 액션
  login: (user, token) =>
    set({
      isLoggedIn: true,
      user,
      token,
    }),

  // 로그아웃 액션
  logout: () =>
    set({
      isLoggedIn: false,
      user: null,
      token: null,
    }),
}));
