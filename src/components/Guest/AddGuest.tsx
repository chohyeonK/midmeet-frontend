// 모임원 추가 컴포넌트

import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import type { GuestAdd, TransportMode } from '../../types/GuestTypes';
import Label from '../common/Label';
import AddressSearchMap from '../party/AddressSearchMap';

const AddGuest: React.FC<GuestAdd> = ({ index, member, onChange, onDelete }) => {
  const memberId = member.memberId;
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(memberId, 'name', e.target.value);
  };
  const handleDeleteClick = () => {
    onDelete(memberId);
  };
  const handleAddrInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(memberId, 'startAddr', e.target.value);
  };

  const handleAddressChange = (fieldName: string, value: string) => {
    // AddressSearchMap props에서 addressFieldName='from'으로 넘겼으므로
    // fieldName이 'from'일 때가 주소 텍스트입니다.
    if (fieldName === 'from') {
      onChange(memberId, 'startAddr', value);
    }

    // (참고) 만약 위도/경도도 저장해야 한다면 MemberData 타입에 필드를 추가하고 아래처럼 처리하세요.
    // else if (fieldName === 'startLatitude') {
    //   onChange(memberId, 'lat', value);
    // }
    // else if (fieldName === 'startLongitude') {
    //   onChange(memberId, 'lng', value);
    // }
  };
  const handleTransportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(memberId, 'transportMode', e.target.value as TransportMode);
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm my-3 space-y-2 p-4'>
      <div className='flex justify-between items-center mb-4'>
        <div className='text-xl font-bold'>모임원 {index + 1}</div>
        <Button buttonName='삭제' onClick={handleDeleteClick} />
      </div>
      <div>
        <div className='block text-left text-gray-700 mt-3'>이름</div>
        <Input type='text' name='guestName' onChange={(e) => handleNameInput(e)} value={member.name} />
      </div>
      <div className='text-left text-gray-700 mt-3'>
        <Label htmlFor='출발지' LabelName='출발지' />
        <AddressSearchMap currentAddress={member.startAddr} setAddressAndField={handleAddressChange} addressFieldName='from' latFieldName='startLatitude' lngFieldName='startLongitude' />
      </div>
      <div className='text-left text-gray-700 mt-3'>
        <Label htmlFor='교통수단' LabelName='교통수단' />
        <select
          value={member.transportMode}
          onChange={handleTransportChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        >
          <option value='PUBLIC'>대중교통</option>
          <option value='PRIVATE'>자가용</option>
        </select>
      </div>
    </div>
  );
};

export default AddGuest;
