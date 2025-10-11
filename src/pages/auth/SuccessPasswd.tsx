import React from 'react';
import StatusForm from '../../components/forms/StatusForm';

const SuccessPasswd: React.FC = () => {
  const props = {
    title: '비밀번호가 변경되었습니다!',
    message: '새 비밀번호로 다시 로그인해주세요.',
    buttonText: '로그인',
    linkTo: {
      pathname: '/login',
    },
  };
  return <StatusForm {...props} />;
};

export default SuccessPasswd;
