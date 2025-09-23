import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  console.log(user);

  return (
    <header className='bg-white'>
      <div className='container mx-auto px-4 py-6 flex items-center justify-between'>
        {/* 로고 */}
        <div className='flex items-center'>
          <Link to='/' className='text-2xl font-bold text-gray-800'>
            미드미트
          </Link>
          {/* 네비게이션 메뉴 (데스크톱) */}
          {/* <nav className='ml-10 hidden md:flex space-x-8'>
            <Link to='/' className='text-gray-600 hover:text-gray-900'>
              홈
            </Link>
          </nav> */}
        </div>

        {/* 로그인/회원가입 버튼 (데스크톱) */}
        {isLoggedIn ? (
          <div className='flex items-center space-x-4'>
            <span className='text-gray-600'>안녕하세요, {user?.name}님!</span>
            <button onClick={logout} className='bg-red-500 text-white py-2 px-4 rounded-md'>
              로그아웃
            </button>
          </div>
        ) : (
          <div className='hidden md:block'>
            <Link to='/login' className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>
              로그인
            </Link>
            <Link to='/signup' className='ml-4 text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-md'>
              회원가입
            </Link>
          </div>
        )}

        {/* 모바일 메뉴 버튼 (모바일) */}
        {/*
          모바일 메뉴는 구현 방식에 따라 토글 로직이 필요합니다.
          예시에서는 버튼만 제공합니다.
        */}
        <div className='md:hidden'>
          <button className='text-gray-600 hover:text-gray-900'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
