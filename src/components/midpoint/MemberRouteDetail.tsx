import React from 'react';
import type { MemberRouteInfo } from '../../types/PartyResultTypes';
import { FaCrown } from 'react-icons/fa';
import Button from '../common/Button';

interface MemberRouteDetailProps {
  member: MemberRouteInfo;
  isLeader: boolean;
}

const MemberRouteDetail: React.FC<MemberRouteDetailProps> = ({ member, isLeader }) => {
  const { name, startAddress, transportMode, routeDetail } = member;

  const displayTransportMode = transportMode === 'PUBLIC' ? '대중교통' : '자가';

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4'>
        {/* -------------------- 1. 상단 정보 (이름, 총 소요 시간) -------------------- */}
        <div className='flex justify-between items-start pb-2 mb-3'>
          {/* 이름 및 출발지 정보 (왼쪽 40%) */}
          <div className='flex flex-col text-left pr-4'>
            {/* 이름 및 왕관 */}
            <h3 className='text-xl font-bold text-gray-900 flex items-center mb-1'>
              {name}
              {isLeader && <FaCrown className='w-5 h-5 ml-2 text-yellow-500 fill-yellow-500' />}
            </h3>

            {/* 상세 출발 정보 */}
            <p className='text-md text-gray-500'>출발지: {startAddress}</p>
            <p className='text-md text-gray-500'>교통수단: {displayTransportMode}</p>
          </div>

          {/* 총 소요 시간 (오른쪽 상단) */}
          <div className='flex-shrink-0 text-right'>
            <p className='text-lg font-bold text-mint-500'>총 {routeDetail.totalTime}</p>
          </div>
        </div>

        {/* -------------------- 2. 상세 경로 및 액션 버튼 (하단) -------------------- */}
        {/* Grid를 사용하여 경로 요약, 길찾기 아이콘, 버튼을 배치 */}
        <div className='grid grid-cols-2 pt-3 border-t border-gray-100'>
          {/* 2-1. 길찾기 요약 정보 (좌측) */}
          <div className='col-span-1 text-left pr-4'>
            <p className='text-lg text-gray-700 mb-1 font-bold'>경로 요약</p>
            <p className='text-md text-gray-500'>{routeDetail.routeSummary}</p>
          </div>

          {/* 2-2. 경로 확인 버튼 (우측 하단) */}
          <div className='col-span-1 flex justify-end items-end'>
            <Button buttonName='경로 확인' className='bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 text-sm' onClick={() => console.log('경로 확인', member)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberRouteDetail;
