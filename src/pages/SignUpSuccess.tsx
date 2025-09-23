import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const SignUpSuccess: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-center px-6 py-12 mx-auto'>
        <div className='flex flex-col items-center'>
          <div className='text-left text-2xl font-semibold text-gray-900 dark:text-white'>{user?.name}님, 환영합니다!</div>
          <div className='text-left mt-4 text-xl/6 text-gray-800 dark:text-gray-200'>
            이제 미드미트와 함께 <br /> 설레는 여정을 시작해볼까요?
          </div>
          <Link to='/' className='mt-8 text-white bg-mint-500 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            홈으로
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignUpSuccess;
