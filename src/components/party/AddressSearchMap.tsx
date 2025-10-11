import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import type { FieldValues, UseFormSetValue } from 'react-hook-form';

// declare global {
//   interface Window {
//     vw: any;
//     vworld: any;
//   }
// }

interface AddressSearchMapProps {
  setAddressAndField: (addressFieldName: string, addressValue: string) => void;
  addressFieldName: string;
  latFieldName: string;
  lngFieldName: string;
}

const AddressSearchMap: React.FC<AddressSearchMapProps> = ({ setAddressAndField, addressFieldName, latFieldName, lngFieldName }) => {
  // const mapRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState('');

  const handleComplete = (data: any) => {
    setIsModalOpen(false);
    setAddress(data.address);
    setAddressAndField(addressFieldName, data.address);
  };

  const postcodeStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    width: '450px',
    height: '600px',
    border: '1px solid #000',
  } as React.CSSProperties;
  return (
    <div className='w-full space-y-3'>
      {/* 팝업 열기 버튼 및 검색된 주소 표시 */}
      <div className='flex space-x-2'>
        <input type='text' value={address} readOnly placeholder='출발지를 검색하세요' className='flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5' />
        <button type='button' onClick={() => setIsModalOpen(true)} className='px-4 py-2 bg-indigo-600 text-white rounded-md flex-shrink-0'>
          주소 검색
        </button>
      </div>

      {/* <div id='map' ref={mapRef} className='w-full h-64 bg-gray-200 rounded-lg border'>
      </div> */}

      {/* 주소 검색 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 z-[999]' onClick={() => setIsModalOpen(false)}>
          <div style={postcodeStyle} onClick={(e) => e.stopPropagation()}>
            <DaumPostcode onComplete={handleComplete} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearchMap;
