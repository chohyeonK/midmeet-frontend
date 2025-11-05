import React from 'react';
import StatusForm from '../../components/forms/StatusForm';

const MidSuccess: React.FC = () => {
  const props = {
    title: '모임이 확정되었습니다!',
    message: '모임원들에게 결과를 공유하세요.',
    buttonText: '공유',
    linkTo: {
      pathname: '/midpoint/result',
    },
  };
  return <StatusForm {...props} />;
};

export default MidSuccess;
