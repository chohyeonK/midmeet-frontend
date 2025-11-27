import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import MainImg from '../assets/images/main.png';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  // user가 null이 아니면 로그인 상태로 간주
  const isLoggedIn = !!user;

  const handleStartClick = () => {
    if (isLoggedIn) {
      // 로그인 되어있으면 바로 모임 시작하게
      navigate('/party/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className='flex justify-center items-center mb-5 flex-col md:flex-row md:gap-8'>
        {' '}
        {/* md:flex-row 와 md:gap-8 추가 */}
        {/* 디바이스 크기별 글자 크기 조절 및 줄 간격 설정 */}
        {/* md:text-left를 추가하여 큰 화면에서는 왼쪽 정렬, 작은 화면에서는 중앙 정렬 가능하게 함 */}
        <div className='flex-1 text-center md:text-left text-3xl sm:text-4xl md:text-5xl leading-relaxed'>
          {' '}
          {/* text-center 추가 */}
          <span className='font-bold'>미드미트,</span>
          <br />
          약속 장소 고민, 이제 그만!
          <br /> 우리가 찾아드릴게요.
          <div className='mt-4'>
            {' '}
            {/* 버튼 위쪽 여백 추가 */}
            <a
              href='#'
              onClick={handleStartClick}
              className='focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 dark:focus:ring-yellow-900'
            >
              시작하기
            </a>
          </div>
        </div>
        {/* 이미지 컨테이너의 너비를 조절하여 텍스트와 균형을 맞춥니다.
            작은 화면에서는 텍스트가 위로, 이미지가 아래로 오도록 flex-col을 사용하고,
            이미지의 너비를 조절하여 너무 크지 않게 합니다.
        */}
        <div className='w-full md:w-1/2 lg:w-1/3 flex items-center justify-center mt-8 md:mt-0'>
          {' '}
          {/* w-full md:w-1/2 lg:w-1/3 및 mt-8 md:mt-0 추가 */}
          <img src={MainImg} alt='Description' className='max-w-full h-auto' /> {/* max-w-full h-auto 추가 */}
        </div>
      </div>
      <div className='bg-gray-50 my-4 px-6 py-10 space-y-2 text-left text-lg sm:text-xl md:text-2xl leading-relaxed'>
        <div className='mb-4 font-bold'>왜 MidMeet일까요?</div>
        <div>✅ 출발지가 달라도, 모두에게 공정한 약속 장소</div>
        <div>✅ 회원가입 없이 바로 시작, 누구나 간편하게</div>
        <div>✅ 장소만? 아니죠, 하루 코스까지 똑똑하게 추천!</div>
      </div>
    </>
  );
};

export default Home;
