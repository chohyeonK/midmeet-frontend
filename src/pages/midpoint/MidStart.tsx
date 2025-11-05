import React, { useEffect, useState } from 'react';
import StatusForm from '../../components/forms/StatusForm';
import Loading from '../../components/common/Loading';

interface StatusFormProps {
  topTitle: string;
  title: string;
  message: string;
  buttonText: string;
  linkTo?: {
    pathname: string;
    state?: any; // state는 선택적 속성으로
  };
}

const MidStart: React.FC = () => {
  const [statusProps, setStatusProps] = useState<StatusFormProps | null>(null);

  useEffect(() => {
    // API 호출 등을 통해 모임명을 받아오는 로직이 여기에 있어야 함

    // 비동기 작업이 끝났다고 가정하고 상태 업데이트
    const setInitialProps = () => {
      setStatusProps({
        topTitle: '모임명', // 실제 모임명으로 변경 필요
        title: '모든 모임원들이 \n정보를 입력하였습니다!',
        message: '버튼을 눌러 추천 코스를 확인하세요.',
        buttonText: '시작',
        linkTo: {
          pathname: '/midpoint/calculate',
        },
      });
    };

    const timer = setTimeout(setInitialProps, 100); // 비동기 작업 시뮬레이션
    return () => clearTimeout(timer);
  }, []);

  if (!statusProps) {
    return <Loading title='미드미트' message='정보를 확인중입니다. 잠시만 기다려주세요.' />;
  }

  return (
    <>
      <StatusForm {...statusProps} />
    </>
  );
};

export default MidStart;
