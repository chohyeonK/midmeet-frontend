import React, { useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// 모임명
// 방장 여부
// 모임 장소 리스트
// 옵션
//   보기(방장일 때만 나오게)
//   수정
//   삭제

interface CourseResponse {
  course_id: string;
  course_no: number;
  place_name: string | null;
  place_address: string | null;
}

// interface Participant {
//   role: string;
// }

interface PartyResponse {
  party_id: string;
  date_time: string;
  party_name: string | null;
  party_type: string | null;
  party_state: boolean;
  courses: CourseResponse[];
  myRole: string;
  // participants: Participant[];
}

type handleShowMidpoint = (partyId: string, role: string) => void;

interface VisitHistoryProps {
  party: PartyResponse;
  className?: string;
  onClick: handleShowMidpoint;
}

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const VisitHistoryItem: React.FC<VisitHistoryProps> = ({ party, className, onClick }) => {
  // console.log(party);
  const navigate = useNavigate();
  const token = getTokenFromStorage();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [partyData, setPartyData] = useState(party);
  const { party_id, myRole } = partyData;

  const userRole = party.myRole;

  const isLeader = userRole === 'LEADER';

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const convertDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const formattedDate = format(dateObject, 'yyyy-MM-dd a h시 m분', { locale: ko });

    return formattedDate;
  };

  const handleViewParty = () => {
    // partyId 추출
    // console.log(partyData);
    navigate(`/midpoint/result/${party_id}`);
  };

  const handleEditParty = () => {
    navigate(`/midpoint/edit/${party_id}`);
  };

  const handleDeleteParty = async () => {
    try {
      if (!window.confirm('정말로 이 모임을 삭제하시겠습니까?')) {
        return;
      }

      const partyId = party.party_id;
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.delete(`${baseURL}/party/${partyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          party_id: partyId,
        },
      });
      console.log(response);

      if (response.status === 200) {
        alert('모임이 성공적으로 삭제되었습니다.');
        window.location.reload();
      }
    } catch (error) {
      console.log('삭제 안됨');
    }
  };

  // onClick이 요구하는 타입 (React.MouseEventHandler)을 위해 래퍼
  const handleClickWrapper = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // 👈 상위 클릭 이벤트 방지
    onClick(party_id, myRole);
  };

  return (
    <div className='w-full min-w-80 min-h-40 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      <div className=''>
        <div>
          <div className='flex justify-between px-6 pt-6 relative'>
            <div className='flex items-center mb-1'>
              <div className='text-2xl font-extrabold mr-3'>{party.party_name}</div>
              {isLeader && <FaCrown className='w-6 h-6 mr-3' />}
              {party.party_state ? (
                <span className='inline-flex items-center text-sm px-2 py-1 rounded-full border border-primary-green text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-300'>
                  <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  진행 중
                </span>
              ) : (
                // party_state가 false면 완료
                <span className='inline-flex items-center text-sm px-2 py-1 rounded-full border border-gray-400 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-300'>
                  <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  완료
                </span>
              )}
            </div>

            <div>
              <button
                data-modal-target='popup-modal'
                data-modal-toggle='popup-modal'
                id='dropdownButton'
                onClick={handleDropdownToggle}
                className='inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5'
                type='button'
              >
                <span className='sr-only'>Open dropdown</span>
                <svg className='w-5 h-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 3'>
                  <path d='M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z' />
                </svg>
              </button>

              {isDropdownOpen && (
                <div id='popup-modal' className='z-10 absolute top-full right-0 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700'>
                  <ul className='py-2' aria-labelledby='dropdownButton'>
                    <li>
                      <a onClick={handleClickWrapper} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                        진행 보기
                      </a>
                    </li>
                    <li>
                      <a onClick={handleViewParty} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                        결과 보기
                      </a>
                    </li>
                    {isLeader && (
                      <>
                        <li>
                          <a onClick={handleEditParty} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                            수정
                          </a>
                        </li>
                        <li>
                          <a onClick={handleDeleteParty} className='block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                            삭제
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className='text-left px-6 text-md font-normal text-gray-500 lg:text-md'>{convertDate(party.date_time)}</div>
        </div>

        <div className='flex flex-col px-6 pb-6'>
          <div className='mt-4 md:mt-6 w-full text-left space-y-3'>
            {party.courses &&
              party.courses.map((course) => (
                <div key={course.course_id}>
                  <span>{course.course_no}.</span> {course.place_name ? course.place_name : '미지정'}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitHistoryItem;
