import React from 'react';
import StatusForm from '../../components/forms/StatusForm';
import { useParams } from 'react-router-dom';

const MidSuccess: React.FC = () => {
  const { partyId } = useParams();

  const props = {
    title: '모임이 확정되었습니다!',
    message: '모임 중간 지점 및 코스 확정 결과가 모든 모임원에게 메일로 발송되었습니다.',
    buttonText: '결과 보러가기',
    linkTo: {
      pathname: `/midpoint/result/${partyId}`,
    },
  };
  return <StatusForm {...props} />;
};

export default MidSuccess;
