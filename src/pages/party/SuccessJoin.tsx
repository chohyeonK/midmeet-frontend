import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusForm from '../../components/forms/StatusForm';
import { usePartyStore } from '../../store/usePartyStore';
import axios from 'axios';

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const SuccessJoin: React.FC = () => {
  const [wholeCount, setWholeCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const partyId = usePartyStore((state) => state.partyId);
  useEffect(() => {
    const getParticipant = async () => {
      const userToken = getTokenFromStorage();
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${baseURL}/party/${partyId}/waiting`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          partyId: partyId,
        },
      });

      if (response.status === 200) {
        setWholeCount(response.data.whole_count);
        setCurrentCount(response.data.current_participant_count);
      }
    };

    getParticipant();
  }, []);
  const props = {
    topTitle: '입력이 완료되었습니다! \n다른 모임원들이 정보를 \n입력할때까지 기다려주세요!',
    title: `${currentCount}/${wholeCount}`,
    message: '완료되면 카카오톡으로 알림을 받을 수 있습니다.',
    buttonText: '홈',
    linkTo: {
      pathname: '/',
    },
  };

  return <StatusForm {...props} />;
};

export default SuccessJoin;
