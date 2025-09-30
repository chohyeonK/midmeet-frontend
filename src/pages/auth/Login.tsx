import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema } from '../../validation/authSchema';
import FormCard from '../../components/common/FormCard';
import LoginForm from '../../components/forms/LoginForm';
import type { SubmitHandler } from 'react-hook-form';

type FormData = yup.InferType<typeof loginSchema>;

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin: SubmitHandler<FormData> = async (data) => {
    setLoginError(null);

    const payload = {
      id: data.userId,
      passwd: data.password,
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/login', payload);
      if (response.status === 200) {
        const { user, token } = response.data;
        login(user, token);
        navigate('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      } else {
        setLoginError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  };

  return (
    <FormCard title='로그인'>
      <LoginForm onSubmit={handleLogin} loginError={loginError} setLoginError={setLoginError} />
    </FormCard>
  );
};

export default Login;
