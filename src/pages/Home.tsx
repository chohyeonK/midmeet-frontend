import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import MainImg from '../assets/images/main.png';
import { useAuthStore } from '../store/useAuthStore';

const SecurityIcon = () => (
  <svg className='w-12 h-12 text-purple-600 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M9 12l2 2 4-4m5.618-4.279A8.002 8.002 0 0012 4C8.683 4 5.786 5.867 4.298 8.653M2.75 14H18c1.105 0 2-.895 2-2V8M2.75 14h-1m20 0h1m-1 6h-1.5a2.5 2.5 0 01-2.5-2.5V14m0-4.25h1.5a2.5 2.5 0 012.5 2.5V14'
    ></path>
  </svg>
);
const AddressBookIcon = () => (
  <svg className='w-12 h-12 text-red-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M12 6.253v13m0-13C10.832 5.477 9.205 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.795 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.795 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.205 18 16.5 18s-3.332.477-4.5 1.253'
    ></path>
  </svg>
);
const ApiDbIcon = () => (
  <svg className='w-12 h-12 text-blue-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 3v2m6-2v2M9 19v2m6-2v2M5 12h2m10 0h2M12 3c3.243 0 5 1.757 5 5s-1.757 5-5 5-5-1.757-5-5 1.757-5 5-5z'></path>
  </svg>
);

const LocationMarkerIcon = () => (
  <svg className='w-12 h-12 text-purple-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'></path> {' '}
  </svg>
);

const PaperAirplaneIcon = () => (
  <svg className='w-12 h-12 text-green-500 mb-4 rotate-90' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' // 종이 비행기 아이콘
    ></path>
  </svg>
);

const CompassIcon = () => (
  <svg className='w-12 h-12 text-blue-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16V4m0 0L3 8m4-4l4 4m6 12V8m0 0l4 4m-4-4l-4 4m-8 6h16a2 2 0 002-2v-8a2 2 0 00-2-2H3a2 2 0 00-2 2v8a2 2 0 002 2z' />
  </svg>
);

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
        {/* md:flex-row 와 md:gap-8 추가 */}
        {/* 디바이스 크기별 글자 크기 조절 및 줄 간격 설정 */}
        {/* md:text-left를 추가하여 큰 화면에서는 왼쪽 정렬, 작은 화면에서는 중앙 정렬 가능하게 함 */}
        <div className='flex-1 text-center md:text-left text-3xl sm:text-4xl md:text-5xl leading-normal'>
          {/* text-center 추가 */}
          <span className='font-bold'>미드미트,</span>
          <br />
          약속 장소 고민, 이제 그만!
          <br /> 우리가 찾아드릴게요.
          <div className='mt-4'>
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
          {/* w-full md:w-1/2 lg:w-1/3 및 mt-8 md:mt-0 추가 */}
          <img src={MainImg} alt='Description' className='max-w-full h-auto' /> {/* max-w-full h-auto 추가 */}
        </div>
      </div>
      <hr className='border-t border-gray-200 my-8' />
      {/* <div className=' px-6 pb-10 space-y-2 text-left text-lg sm:text-xl md:text-2xl leading-relaxed'>
        <div className='mb-4 font-bold'>왜 MidMeet일까요?</div>
        <div>✅ 출발지가 달라도, 모두에게 공정한 약속 장소</div>
        <div>✅ 회원가입 없이 바로 시작, 누구나 간편하게</div>
        <div>✅ 장소만? 아니죠, 하루 코스까지 똑똑하게 추천!</div>
      </div> */}
      {/* "왜 MidMeet일까요?" 섹션 (Pincobiz의 카드형 섹션 디자인 차용) */}
      <section className='pt-3 pb-16 bg-white px-4 md:px-8'>
        <h2 className='text-3xl md:text-4xl font-extrabold text-center text-primary-navy mb-12 text-left'>
          미드미트, <br />
          <span className='text-primary-green'>무엇이 다른가요?</span>
        </h2>

        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* 카드 1 */}
          <div className='bg-light-green-bg p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300'>
            {/* 아이콘 (Pincobiz 처럼) */}
            <LocationMarkerIcon />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>공정한 약속 장소</h3>
            <p className='text-gray-600'>
              출발지가 달라도, 모두에게 공정한 <br /> 약속 장소를 찾아드려요.
            </p>
          </div>

          {/* 카드 2 */}
          <div className='bg-light-yellow-bg p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300'>
            <PaperAirplaneIcon />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>간편한 시작</h3>
            <p className='text-gray-600'>
              회원가입 없이 바로 시작하여 <br /> 누구나 간편하게 이용할 수 있어요.
            </p>
          </div>

          {/* 카드 3 */}
          <div className='bg-light-purple-bg p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300'>
            <CompassIcon />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>맞춤 코스 추천</h3>
            <p className='text-gray-600'>
              장소뿐만 아니라 하루 코스까지 <br /> 똑똑하게 추천해 드립니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
