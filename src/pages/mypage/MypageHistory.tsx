import React, { useEffect, useState } from 'react';
import FormCard from '../../components/common/FormCard';
import VisitHistoryItem from '../../components/VisitHistoryItem';
import axios from 'axios';

// [
//     {
//         "party_id": "cmg9lyz2k0000vpigqvrxn3fd",
//         "date_time": "2025-12-31T18:30:00.000Z",
//         "party_name": "테스트 모임2",
//         "party_type": null,
//         "party_state": true,
//         "courses": [
//             {
//                 "course_id": "cmg9n3tnl0000vp00wtxuzl7x",
//                 "course_no": 1,
//                 "place_name": null,
//                 "place_address": null
//             },
//             {
//                 "course_id": "cmg9n3tnl0001vp00fadyilc6",
//                 "course_no": 2,
//                 "place_name": null,
//                 "place_address": null
//             }
//         ]
//     }
// ]

interface CourseResponse {
  course_id: string;
  course_no: number;
  course_placeName: string | null;
  course_placeAddress: string | null;
}

interface PartyResponse {
  party_id: string;
  date_time: string;
  party_name: string | null;
  party_type: string | null;
  party_state: boolean;
  courses: CourseResponse[];
}

type PartyList = PartyResponse[];

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const MypageHistory: React.FC = () => {
  const [partyList, setPartyList] = useState<PartyList | null>();
  const [isLoading, setIsLoading] = useState(true);
  const token = getTokenFromStorage();

  useEffect(() => {
    const fectchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/visits', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        if (response.status === 200) {
          setPartyList(response.data);
        }
      } catch (error) {
        console.log(error);
        // setParty([]);
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
            <VisitHistoryItem key={party.party_id} party={party} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MypageHistory;
