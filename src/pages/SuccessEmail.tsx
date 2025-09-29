import React from 'react';
import StatusForm from '../components/forms/StatusForm';

const SuccessEmail: React.FC = () => {
  const props = {
    title: '이메일 인증이 완료되었습니다!',
    message: '이제 미드미트의 모든 기능을 제약 없이 이용하실 수 있습니다. \n지금 바로 약속 장소를 찾아보세요!',
    buttonText: '로그인',
    linkTo: '/login',
  };
  return <StatusForm {...props} />;
};

export default SuccessEmail;
