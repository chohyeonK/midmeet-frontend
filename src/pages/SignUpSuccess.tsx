import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const SignUpSuccess: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <section className=''>
      <div className='flex flex-col items-center justify-center px-6 py-12 mx-auto'>
        <div className='flex flex-col'>
          <div className='text-left text-2xl font-semibold text-gray-900 dark:text-white'>{user?.name}님, 환영합니다!</div>
          <div className='text-left mt-4 text-xl/6 text-gray-800 dark:text-gray-200'>
            가입하신 이메일로 인증 메일을 보냈어요. <br /> 메일함을 확인하고 인증을 완료해 주세요. <br /> 그럼 이제 미드미트의 모든 기능을 사용할 수 있답니다!
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
