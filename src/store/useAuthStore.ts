import { create } from 'zustand';
import axios from 'axios';

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
  isAuthReady: boolean;
  login: (user: User, token: string) => void; // 로그인 액션
  logout: () => void; // 로그아웃 액션
  initializeAuth: () => void;
}

const getTokenFromStorage = () => localStorage.getItem('token') || null;

// Zustant 스토어를 생성합니다.
export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  isAuthReady: false,

  // 로그인 액션
  login: (user, token) => {
    (set({
      isLoggedIn: true,
      user,
      token,
    }),
      localStorage.setItem('token', token));
  },

  // 로그아웃 액션
  logout: () => {
    (set({
      isLoggedIn: false,
      user: null,
      token: null,
    }),
      localStorage.removeItem('token'));
  },

  initializeAuth: async () => {
    const token = getTokenFromStorage();
    if (token) {
      try {
        const response = await axios.get('http://localhost:3000/user/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const user = response.data.user;
          set({ isLoggedIn: true, user, token });
        } else {
          get().logout();
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        get().logout();
      }
    }
    set({ isAuthReady: true });
  },
}));
