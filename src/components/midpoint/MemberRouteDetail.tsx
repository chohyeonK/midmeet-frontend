import React, { useState } from 'react';
import type { MemberRouteInfo } from '../../types/MidResultTypes';
import { FaCrown } from 'react-icons/fa';
import Button from '../common/Button';

interface MemberRouteDetailProps {
  member: MemberRouteInfo;
  isLeader: boolean;
}

const MemberRouteDetail: React.FC<MemberRouteDetailProps> = ({ member, isLeader }) => {
  // member 객체에서 필요한 정보 구조 분해 할당
  const { name, startAddr, transportMode, routeDetail } = member;
  const { routeSteps } = routeDetail;
  
  // 상세 경로 요약 표시/숨김을 위한 상태
  const [display, setDisplay] = useState(false);

  // 교통수단 표시명 설정
  const displayTransportMode = transportMode === 'PUBLIC' ? '대중교통' : '자가';

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4'>
        <div className='flex justify-between items-start pb-2 mb-3'>
          <div className='flex flex-col text-left pr-4'>
            <h3 className='text-xl font-bold text-gray-900 flex items-center mb-1'>
              {name}
              {isLeader && <FaCrown className='w-5 h-5 ml-2 text-yellow-500 fill-yellow-500' />}
            </h3>

            <p className='text-md text-gray-500'>출발지: {startAddr}</p>
            <p className='text-md text-gray-500'>교통수단: {displayTransportMode}</p>
          </div>

          <div className='flex-shrink-0 text-right'>
            <p className='text-lg font-bold text-mint-500'>총 {routeDetail.totalTime}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 pt-3 border-t border-gray-100'>
          {display && (
            <div className='col-span-1 text-left pr-4'>
              <p className='text-lg text-gray-700 mb-1 font-bold'>경로 요약</p>

              <div className='text-md text-gray-500'>
                {routeSteps.map((step, index) => (
                  <div key={index}>{step}</div>
                ))}
              </div>
            </div>
          )}


          <div className={
            display
              ? 'col-span-1 flex justify-end items-end'
              : 'col-span-2 flex justify-end items-end'
          }>
            <Button
              buttonName={display ? '경로 닫기' : '경로 확인'}
              className='bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 text-sm'
              onClick={() => setDisplay(() => !display)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberRouteDetail;