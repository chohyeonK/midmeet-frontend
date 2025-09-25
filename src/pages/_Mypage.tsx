import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { mypageSchema } from '../validation/authSchema';

type FormData = yup.InferType<typeof mypageSchema>;

const Mypage: React.FC = () => {
  const { user } = useAuthStore();

  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(mypageSchema), // Yup 스키마를 리졸버로 연결
    defaultValues: {
      email: user?.email,
      password: '',
      userName: user?.name,
      phoneNumber: user?.phone,
    },
  });
  return (
    <>
      <section className=''>
        <div className='flex flex-col items-center justify-center px-6 mx-auto'>
          <div className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>회원 정보</div>
          <div className='w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <form className='space-y-4 md:space-y-6' action='#' method='POST'>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='userId' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      아이디
                    </label>
                  </div>
                  <div className='flex items-center justify-between space-x-4'>
                    <input
                      disabled
                      type='userId'
                      name='userId'
                      id='userId'
                      defaultValue={user?.id}
                      className='flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='user'
                    />
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      현재 이메일
                    </label>
                  </div>

                  <div className='flex items-center justify-between space-x-4'>
                    <input
                      type='email'
                      name='email'
                      id='currentEmail'
                      defaultValue={user?.email}
                      className='flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='name@company.com'
                      disabled
                    />
                  </div>
                  {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      새 이메일
                    </label>
                  </div>

                  <div className='flex items-center justify-between space-x-4'>
                    <input
                      {...register('email')}
                      type='email'
                      name='email'
                      id='email'
                      className='flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='name@company.com'
                      required
                    />
                    <button
                      type='submit'
                      className='w-28 flex-shrink-0 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500'
                    >
                      인증
                    </button>
                  </div>
                  {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      새로운 비밀번호
                    </label>
                  </div>
                  <input
                    {...register('password')}
                    type='password'
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    required
                  />
                  {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='confirmPassword' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      비밀번호 재확인
                    </label>
                  </div>
                  <div className='flex items-center justify-between space-x-4'>
                    <input
                      {...register('confirmPassword')}
                      type='password'
                      name='confirmPassword'
                      id='confirmPassword'
                      placeholder='••••••••'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      required
                    />
                    <button
                      type='submit'
                      className='w-28 flex-shrink-0 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500'
                    >
                      수정
                    </button>
                  </div>

                  {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      현재 이름
                    </label>
                  </div>
                  <input
                    type='text'
                    name='currentUserName'
                    id='currentUserName'
                    defaultValue={user?.name}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    disabled
                  />
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      새로운 이름
                    </label>
                  </div>
                  <input
                    {...register('userName')}
                    type='text'
                    name='userName'
                    id='userName'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='홍길동'
                  />
                  {errors.userName && <p className='text-red-500'>{errors.userName.message}</p>}
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='phoneNumber' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      현재 전화번호
                    </label>
                  </div>
                  <input
                    type='text'
                    name='currentPhoneNumber'
                    id='currentPhoneNumber'
                    defaultValue={user?.phone}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    disabled
                  />
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='phoneNumber' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      새로운 전화번호
                    </label>
                  </div>
                  <input
                    {...register('phoneNumber')}
                    type='text'
                    name='phoneNumber'
                    id='phoneNumber'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='01012345678'
                  />
                  {errors.phoneNumber && <p className='text-red-500'>{errors.phoneNumber.message}</p>}
                </div>
                <div className='flex items-center justify-between space-x-4'>
                  <button
                    type='button'
                    className='grow text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 flex items-center justify-center'
                  >
                    취소
                  </button>
                  <button
                    type='submit'
                    className='grow rounded-lg bg-mint-500 focus:ring-4 focus:ring-indigo-300 font-medium text-sm px-5 py-2.5 text-white shadow-xs focus:outline-none dark:bg-indigo-600 dark:shadow-none dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 flex items-center justify-center'
                  >
                    수정
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Mypage;
