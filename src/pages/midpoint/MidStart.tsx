import React, { useEffect, useState } from 'react';
import StatusForm from '../../components/forms/StatusForm';
import Loading from '../../components/common/Loading';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

const getTokenFromStorage = () => localStorage.getItem('token') || null;


const MidStart: React.FC = () => {
  const [statusProps, setStatusProps] = useState<StatusFormProps | null>(null);
  const { partyId } = useParams();
  const token = getTokenFromStorage();

  useEffect(() => {
    if (!partyId) return;

    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/party/${partyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const { party_name } = response.data;
          setStatusProps({
            topTitle: party_name, // 실제 모임명으로 변경 필요
            title: '모든 모임원들이 \n정보를 입력하였습니다!',
            message: '버튼을 눌러 추천 코스를 확인하세요.',
            buttonText: '시작',
            linkTo: {
              pathname: `/midpoint/calculate/${partyId}`,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching party data:', error);
      }
    }

    fetchData();
  }, [partyId, token]);

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
