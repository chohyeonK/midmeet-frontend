import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, type To } from 'react-router-dom';
import StatusForm from '../../components/forms/StatusForm';
import axios from 'axios';
import { usePartyStore } from '../../store/usePartyStore';

interface StatusFormProps {
  topTitle: string;
  title: string;
  message: string;
  buttonText: string;
  linkTo: {
    pathname: string;
    state?: any; // state는 선택적 속성으로
  };
}

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const JoinParty: React.FC = () => {
  const { partyId, token } = useParams();
  const [statusProps, setStatusProps] = useState<StatusFormProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setParty = usePartyStore((state) => state.setPartyId);

  useEffect(() => {
    const getJoinParty = async () => {
      try {
        if (partyId) {
          setParty(partyId);
        }
        const userToken = getTokenFromStorage();
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/party/${partyId}/verify-invite`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            token: token,
          },
        });

        if (response.status === 200) {
          const { party_name } = response.data;
          setStatusProps({
            topTitle: party_name,
            title: '모임 초대가 도착했습니다! \n모임에 참여하여 새로운 만남을 시작해 보세요.',
            message: '모임원 정보를 입력하여 시작하세요.',
            buttonText: '시작',
            // linkTo: '/join/input',
            linkTo: {
              pathname: '/join/input',
              state: { partyName: party_name },
            },
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getJoinParty();
  }, []);

  if (isLoading) {
    return <div className='text-center mt-20 text-xl font-medium'>초대장 확인 중...</div>;
  }

  return <>{statusProps && <StatusForm {...statusProps} />}</>;
};

export default JoinParty;
