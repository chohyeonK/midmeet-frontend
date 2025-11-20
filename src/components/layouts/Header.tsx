import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Logo from '../../../src/assets/images/logo_midmeet.png';

const Header: React.FC = ({}) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // user가 null이 아니면 로그인 상태로 간주
  const isLoggedIn = !!user;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className='px-4 py-4 flex items-center justify-between'>
        {/* 로고 */}
        <div className=''>
          <Link to='/' className='text-2xl font-bold text-gray-800'>
            <img src={Logo} width={210} />
          </Link>
        </div>

        {/* 로그인/회원가입 버튼 (데스크톱) */}
        <div className='md:block hidden'>
          {isLoggedIn ? (
            <div className='flex items-center space-x-4'>
              <span className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>안녕하세요, {user?.name || '손님'}님!</span>
              <Link to='/party/create' className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>
                모임 생성
              </Link>
              <Link to='/mypage' className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>
                회원정보
              </Link>
              <Link to='/mypage/history' className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>
                방문기록
              </Link>
              <button onClick={logout} className='bg-red-500 text-white py-2 px-4 rounded-md'>
                로그아웃
              </button>
            </div>
          ) : (
            <div className='flex items-center space-x-4'>
              <Link to='/party/create' className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>
                모임 생성
              </Link>
              <Link to='/login' className='text-gray-600 hover:text-gray-900 py-2 px-4 rounded-md'>
                로그인
              </Link>
              <Link to='/signup' className='ml-4 text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-md'>
                회원가입
              </Link>
            </div>
          )}
        </div>

        <div className='md:hidden'>
          <button className='text-gray-600 hover:text-gray-900' onClick={handleMenuToggle}>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className='md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-50 flex flex-col space-y-4'>
            {isLoggedIn ? (
              <>
                <span className='text-gray-600'>안녕하세요, {user?.name}님!</span>
                <Link to='/mypage' className='text-gray-600 hover:text-gray-900'>
                  회원정보
                </Link>
                <Link to='/mypage/history' className='text-gray-600 hover:text-gray-900'>
                  방문기록
                </Link>
                <button onClick={logout} className='bg-red-500 text-white py-2 px-4 rounded-md'>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='text-gray-600 hover:text-gray-900'>
                  로그인
                </Link>
                <Link to='/signup' className='text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-md'>
                  회원가입
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
