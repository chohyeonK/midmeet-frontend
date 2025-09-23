import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { signUpSchema } from '../validation/authSchema';

// 폼 데이터의 타입을 정의합니다.
// 스키마에 정의된 필드와 일치해야 합니다.
type FormData = yup.InferType<typeof signUpSchema>;

// React.FC는 이 컴포넌트가 함수형 컴포넌트임을 명시해줍니다.
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

  const onSubmit = async (data: FormData) => {
    // console.log(data);

    // [추후] 번호 양식 변경 필요
    const payload = {
      id: data.userId,
      email: data.email,
      passwd: data.password,
      name: data.userName,
      phone: '+821012345678',
    };

    console.log(payload);

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
      console.log(error);
    }
  };

  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>회원가입</div>
        <div className='w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <form className='space-y-4 md:space-y-6' action='#' method='POST' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor='userId' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    아이디
                  </label>
                </div>
                <div className='flex items-center justify-between space-x-4'>
                  <input
                    {...register('userId')}
                    type='userId'
                    name='userId'
                    id='userId'
                    // flex-1 클래스를 추가하여 남은 공간을 모두 채웁니다.
                    className='flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='user1'
                    required
                  />
                  <button
                    type='button'
                    onClick={handleUserIdCheck}
                    className='flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500'
                  >
                    중복확인
                  </button>
                </div>
                {errors.userId && <p className='text-red-500'>{errors.userId.message}</p>}
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    이메일
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
                    className='flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500'
                  >
                    인증
                  </button>
                </div>
                {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    비밀번호
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
                <input
                  {...register('confirmPassword')}
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
                {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    이름
                  </label>
                </div>
                <input
                  {...register('userName')}
                  type='text'
                  name='userName'
                  id='userName'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='홍길동'
                  required
                />
                {errors.userName && <p className='text-red-500'>{errors.userName.message}</p>}
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor='phoneNumber' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    전화번호
                  </label>
                </div>
                <input
                  {...register('phoneNumber')}
                  type='text'
                  name='phoneNumber'
                  id='phoneNumber'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='01012345678'
                  required
                />
                {errors.phoneNumber && <p className='text-red-500'>{errors.phoneNumber.message}</p>}
              </div>
              {/* <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    id='terms'
                    aria-describedby='terms'
                    type='checkbox'
                    className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                    required
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label htmlFor='terms' className='font-light text-gray-500 dark:text-gray-300'>
                    I accept the{' '}
                    <a className='font-medium text-primary-600 hover:underline dark:text-primary-500' href='#'>
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div> */}
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-mint-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500'
              >
                회원가입
              </button>
              {/* <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                Already have an account?{' '}
                <Link to='/login' className='font-medium text-primary-600 hover:underline dark:text-primary-500'>
                  Login here
                </Link>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
