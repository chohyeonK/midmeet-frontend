import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation/authSchema';
import Label from '../common/Label';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

type FormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  // 부모 컴포넌트로부터 유효한 폼 데이터를 처리할 함수 받음
  onSubmit: SubmitHandler<FormData>;
  // 로그인 실패 시 부모로부터 에러 메시지 받음
  loginError: string | null;
  // 부모로부터 로딩 상태 받음
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
  customClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loginError, setLoginError, customClick }) => {
  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema), // Yup 스키마를 리졸버로 연결
  });

  const handleFormSubmit = (data: FormData) => {
    setLoginError(null);
    onSubmit(data);
  };
  return (
    <>
      <form className='space-y-6' onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userId' LabelName='아이디' />
            <Link to='/find-id' className='text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
              아이디 찾기
            </Link>
          </div>
          <div className='mt-2'>
            <Input name='userId' type='text' register={register} error={errors.userId} />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userPasswd' LabelName='비밀번호' />
            <Link to='/find-passwd' className='text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
              비밀번호 찾기
            </Link>
          </div>
          <div className='mt-2'>
            <Input name='password' type='password' register={register} error={errors.password} />
          </div>
        </div>

        {loginError && <p className='text-red-500'>아이디 혹은 비밀번호가 일치하지 않습니다.</p>}

        <Button type='submit' buttonName='로그인' className='w-full ' />
      </form>
      <hr />
      <Button type='submit' buttonName='비회원으로 시작하기' className='w-full bg-gray-400' onClick={customClick} />

      <p className='mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400'>
        아직 회원이 아니신가요?{' '}
        <Link to='/signup' className='font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
          회원가입
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
