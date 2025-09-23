<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React from 'react';
>>>>>>> a37f7094d3cd6ea3c7056694f67b201110396fc5
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../validation/authSchema';

type FormData = yup.InferType<typeof loginSchema>;

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
<<<<<<< HEAD
  const [loginError, setLoginError] = useState<boolean | null>(null);
=======
>>>>>>> a37f7094d3cd6ea3c7056694f67b201110396fc5

  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema), // Yup 스키마를 리졸버로 연결
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const payload = {
      id: data.userId,
      passwd: data.password,
    };
    console.log(payload);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', payload);
      console.log(response);

      if (response.status === 200) {
        // 회원가입 성공
        // 세션 저장 + 환영 페이지 이동
        const user = {
          id: data.userId,
        };
        const { token } = response.data;
        login(user, token);
        navigate('/');
      }
    } catch (error) {
<<<<<<< HEAD
      if (axios.isAxiosError(error) && error.response) {
        // 아이디, 비밀번호 일치 안함
        if (error.response.status === 401) {
          setLoginError(true);
        }
      }
=======
      console.log(error);
>>>>>>> a37f7094d3cd6ea3c7056694f67b201110396fc5
    }
  };
  return (
    <div>
      {/* <p className='text-4xl'>로그인</p> */}

      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white'>로그인</h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form action='#' method='POST' className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='email' className='block text-sm/6 font-medium text-gray-900 dark:text-gray-100'>
                  아이디
                </label>
                <div className='text-sm'>
                  <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
                    아이디 찾기
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  {...register('userId')}
                  id='userId'
                  name='userId'
                  type='text'
                  required
                  autoComplete='userId'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500'
                />
                {errors.userId && <p className='text-red-500'>{errors.userId.message}</p>}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='password' className='block text-sm/6 font-medium text-gray-900 dark:text-gray-100'>
                  비밀번호
                </label>
                <div className='text-sm'>
                  <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
                    비밀번호 찾기
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  {...register('password')}
                  type='password'
                  name='password'
                  id='password'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
                {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
              </div>
            </div>

<<<<<<< HEAD
            {loginError && <p className='text-red-500'>아이디 혹은 비밀번호가 일치하지 않습니다.</p>}

=======
>>>>>>> a37f7094d3cd6ea3c7056694f67b201110396fc5
            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-mint-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500'
              >
                로그인
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400'>
            아직 회원이 아니신가요?{' '}
            <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
