import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { signUpSchema } from '../../validation/authSchema';
import FormCard from '../../components/common/FormCard';
import SignUpForm from '../../components/forms/SignUpForm';

// 폼 데이터의 타입을 정의합니다.
// 스키마에 정의된 필드와 일치해야 합니다.
type FormData = yup.InferType<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    getValues, // 입력 필드 값을 가져오는 함수
    trigger, // 특정 필드의 유효성 검사를 수동으로 실행
    resetField, // 특정 필드 초기화하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(signUpSchema), // Yup 스키마를 리졸버로 연결
  });

  const handleSignup = async (data: FormData) => {
    const payload = {
      id: data.userId,
      email: data.email,
      passwd: data.password,
      name: data.userName,
      phone: '+82' + data.phoneNumber,
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/signup', payload);
      console.log(response);

      if (response.status === 201) {
        // 회원가입 성공
        // 세션 저장 + 환영 페이지 이동
        const { user, token } = response.data;
        login(user, token);
        navigate('/signup/success');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserIdCheck = async () => {
    const isValid = await trigger('userId');

    if (isValid) {
      checkUserIdDuplication();
    }
  };

  const checkUserIdDuplication = async () => {
    // 아이디 중복 확인 메소드
    const userId = getValues('userId');
    try {
      const response = await axios.get(`http://localhost:3000/user/check-id?id=${userId}`);

      if (response.status === 200) {
        const { available } = response.data;

        if (available) {
          alert('사용 가능한 아이디입니다.');
        } else {
          alert('사용할 수 없는 아이디입니다.');
          resetField('userId');
        }
      }
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };

  return (
    <FormCard title='회원가입'>
      <SignUpForm onSubmit={handleSignup} onUserIdCheck={handleUserIdCheck} register={register} handleSubmit={handleSubmit} errors={errors} />{' '}
    </FormCard>
  );
};

export default SignUp;
