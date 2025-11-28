import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 👈 useLocation 추가
import * as yup from 'yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema } from '../../validation/authSchema';
import FormCard from '../../components/common/FormCard';
import LoginForm from '../../components/forms/LoginForm';
import type { SubmitHandler } from 'react-hook-form';
import LoadingOverlay from '../../components/common/LoadingOverlay';

type FormData = yup.InferType<typeof loginSchema>;

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 현재 위치 정보를 가져옵니다.
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // PrivateRoute에서 전달받은 'from' 경로를 추출
  // 경로가 없으면 기본값인 '/' (Home)으로 설정
  const from = location.state?.from?.pathname || '/';

  const handleLogin: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    const payload = {
      id: data.userId,
      passwd: data.password,
    };

    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${baseURL}/auth/login`, payload);
      if (response.status === 200) {
        const { user, token } = response.data;
        login(user, token);

        navigate(from, { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      } else {
        setLoginError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 비회원 처리 함수
  const handleGuest = () => {
    navigate('/guest/create');
  };

  return (
    <FormCard title='로그인'>
      <LoadingOverlay isOverlay={true} isActive={isLoading} />
      <LoginForm onSubmit={handleLogin} loginError={loginError} setLoginError={setLoginError} customClick={handleGuest} />
    </FormCard>
  );
};

export default Login;
