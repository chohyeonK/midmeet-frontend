import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Layout from './components/layouts/Layout';
import SuccessSignUp from './pages/auth/SuccessSignUp';
import Mypage from './pages/mypage/Mypage';
import MypageHistory from './pages/mypage/MypageHistory';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/layouts/PrivateRoute';
import { useAuthStore } from './store/useAuthStore';
import FindId from './pages/auth/FindId';
import FindPasswd from './pages/auth/FindPasswd';
import ResetPasswd from './pages/auth/ResetPasswd';
import SuccessPasswd from './pages/auth/SuccessPasswd';
import SuccessEmail from './pages/auth/SuccessEmail';
import Create from './pages/party/Create';
import SuccessParty from './pages/party/SuccessParty';
import JoinParty from './pages/party/JoinParty';
import JoinInput from './pages/party/JoinInput';
import SuccessJoin from './pages/party/SuccessJoin';
import MidFinding from './pages/midpoint/MidFinding';
import MidStart from './pages/midpoint/MidStart';
import MidSuccess from './pages/midpoint/MidSuccess';
import MidResult from './pages/midpoint/MidResult';
import MidEdit from './pages/midpoint/MidEdit';

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
          <Route path='/signup/success' element={<SuccessSignUp />} />
          <Route path='/signup/success/completed' element={<SuccessEmail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/find-id' element={<FindId />} />
          <Route path='/find-passwd' element={<FindPasswd />} />
          <Route path='/reset-passwd' element={<ResetPasswd />} />
          <Route path='/reset-passwd/success' element={<SuccessPasswd />} />
          <Route element={<PrivateRoute />}>
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/mypage/history' element={<MypageHistory />} />
            {/* <Route path='/party/create' element={<Create />} /> */}
            <Route path='/party/success' element={<SuccessParty />} />
            <Route path='/join/:partyId/:token' element={<JoinParty />} />
            <Route path='/join/input' element={<JoinInput />} />
            <Route path='/join/success' element={<SuccessJoin />} />
            {/* 컴포넌트 수정 예정 */}
            <Route path='/midpoint/start' element={<MidStart />} />
            <Route path='/midpoint/calculate/:partyId' element={<MidFinding />} />
            <Route path='/midpoint/success' element={<MidSuccess />} />
            <Route path='/midpoint/result/:partyId' element={<MidResult />} />
            <Route path='/midpoint/edit/:partyId' element={<MidEdit />} />
          </Route>

          <Route path='/party/create' element={<Create />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
