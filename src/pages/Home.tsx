import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import Button from '../components/common/Button';

// 폰트 디바이스별 조정 필요

const Home = () => {
  return (
    <>
      <div className='flex justify-between mb-5'>
        {/* 디바이스 크기별 글자 크기 조절 및 줄 간격 설정 */}
        <div className='flex-1 text-left text-3xl sm:text-4xl md:text-5xl leading-relaxed'>
          <span className='font-bold'>미드미트,</span>
          <br />
          약속 장소 고민, 이제 그만!
          <br /> 우리가 찾아드릴게요.
          <Button
            type='button'
            buttonName='시작하기'
            className='focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 my-4 dark:focus:ring-yellow-900'
          />
        </div>
        <div className='w-1/3 flex items-center justify-center'>
          {/* <img src='your-image-url.jpg' alt='Description' /> */}
          사진
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
