import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Layout from './components/layouts/Layout';
import SignUpSuccess from './pages/SignUpSuccess';
import Mypage from './pages/Mypage';
import MypageHistory from './pages/MypageHistory';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/layouts/PrivateRoute';
import { useAuthStore } from './store/useAuthStore';
import FindId from './pages/FindId';
import FindPasswd from './pages/FindPasswd';

function App() {
  const { isAuthReady, initializeAuth } = useAuthStore();

  useEffect(() => {
    // 앱이 처음 로드될 때만 인증 상태를 초기화
    initializeAuth();
  }, []); // initializeAuth 함수가 변경될 때만 재실행

  if (!isAuthReady) {
    // 인증 상태가 준비될 때까지 로딩 화면을 띄움
    return <div>로딩 중...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/find-id' element={<FindId />} />
          <Route path='/find-passwd' element={<FindPasswd />} />
          <Route element={<PrivateRoute />}>
            <Route path='/signup/success' element={<SignUpSuccess />} />
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/mypage/history' element={<MypageHistory />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
