import React, { useEffect, useState } from 'react';
import FormCard from '../../components/common/FormCard';
import VisitHistoryItem, { type PartyResponse } from '../../components/VisitHistoryItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// const BASE_URL = import.meta.env.VITE_LOCAL_SERVER_URL;
type PartyList = PartyResponse[];

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const MypageHistory: React.FC = () => {
  const [partyList, setPartyList] = useState<PartyList | null>();
  const [isLoading, setIsLoading] = useState(true);
  const token = getTokenFromStorage();
  const navigate = useNavigate();

  const handleShowMidpoint = (partyId: string, role: string) => {
    // 리더만 접근 가능, 모임원들은 얼럿창으로 제한
    const isLeader: boolean = role === 'LEADER';
    if (isLeader) {
      navigate(`/midpoint/calculate/${partyId}`);
    } else {
      alert('모임장만 중간지점을 도출할 수 있습니다.');
    }
  };

  useEffect(() => {
    const fectchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseURL}/user/visits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        if (response.status === 200) {
          setPartyList(response.data);
        }
      } catch (error) {
        // console.log(error);
        alert('방문 기록 조회에 문제가 발생하였습니다. 잠시후에 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fectchData();
  }, []);

  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (!partyList) {
    return <div>생성된 모임이 없습니다.</div>;
  }

  return (
    <>
      <h1 className='mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>방문 기록</h1>
      <div className='flex flex-col items-center justify-center px-6 mx-auto max-w-sm sm:max-w-5xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {partyList.map((party) => (
            <VisitHistoryItem key={party.party_id} party={party} onClick={handleShowMidpoint} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MypageHistory;
