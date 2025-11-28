import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import StatusForm, { type StatusProps } from '../../components/forms/StatusForm';
import { usePartyStore } from '../../store/usePartyStore';
import axios from 'axios';

// interface StatusFormProps {
//   title: string;
//   message: string;
//   buttonText: string;
//   url: string | null;
//   method?:
// }

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const SuccessParty: React.FC = () => {
  const token = getTokenFromStorage();
  const navigate = useNavigate();
  // API 호출 결과 저장할 상태 선언
  const [statusProps, setStatusProps] = useState<StatusProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { partyId } = usePartyStore();
  // const BASE_URL = 'http://localhost:5173';

  const handleCopy = async (textLink: string) => {
    await navigator.clipboard.writeText(textLink);
  };

  useEffect(() => {
    // partyId가 없으면 API 호출 하지 않음
    if (!partyId) {
      navigate('/');
    }

    const getPartyId = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/party/${partyId}/invite`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const { token } = response.data;

          const baseURL = import.meta.env.VITE_APP_URL;
          const joinLink = partyId && token ? `${baseURL}/join/${partyId}/${token}` : '링크 생성 정보가 없습니다.';
          setStatusProps({
            title: '모임이 생성되었습니다!',
            message: '아래 공유 버튼으로 링크를 복사하여\n 모임원들에게 공유하여 시작해주세요.',
            buttonText: '공유(복사)',
            url: joinLink,
            handleClick: handleCopy,
          });
        }
      } catch (error) {
        console.log('링크 생성 실패 ', error);
      } finally {
        setIsLoading(false);
      }
    };
    getPartyId();
  }, []);

  if (isLoading || !statusProps) {
    return <div className='text-center mt-20'>링크 생성 중...</div>;
  }

  return <StatusForm {...statusProps} />;
};

export default SuccessParty;
