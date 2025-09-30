import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import StatusForm from '../../components/forms/StatusForm';

const SuccessSignUp: React.FC = () => {
  const { user } = useAuthStore();
  const props = {
    title: user?.name + '님, 환영합니다!',
    message: '가입하신 이메일로 인증 메일을 보냈어요. \n 메일함을 확인하고 인증을 완료해 주세요. \n 그럼 이제 미드미트의 모든 기능을 사용할 수 있답니다!',
    buttonText: '홈',
    linkTo: '/',
  };

  return <StatusForm {...props} />;
};

export default SuccessSignUp;
