import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import StatusForm from '../../components/forms/StatusForm';

const SuccessParty: React.FC = () => {
  const { user } = useAuthStore();
  const props = {
    title: '모임이 생성되었습니다!',
    message: '모임원들에게 공유하여 모임을 시작하세요.',
    buttonText: '공유',
    linkTo: '/',
  };

  return <StatusForm {...props} />;
};

export default SuccessParty;
