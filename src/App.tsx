import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Layout from './components/layouts/Layout';
import SignUpSuccess from './pages/SignUpSuccess';
import Mypage from './pages/Mypage';
import MypageHistory from './pages/MypageHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/mypage' element={<Mypage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
