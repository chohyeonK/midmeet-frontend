import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import type { FieldValues, UseFormSetValue } from 'react-hook-form';

// 카카오 API 키 설정 (git에 API 키 따로 빼기, 안올라가게)
const KAKAO_REST_API_KEY = '6d6d40972729805f93f53c1d8e1631cf';
const KAKAO_JS_API_KEY = '982cda5f121817461fd4f66869b9e6fb';
const KAKAO_GEOCODE_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
const VWORLD_API_KEY = 'A6E1C7F8-A878-32F7-A607-D7B0B08C5576';

// TypeScript에서 전역 객체인 'daum'과 'kakao'를 인식하도록 선언
declare global {
  interface Window {
    vw: any;
    vworld: any;
  }
}
interface AddressSearchMapProps {
  setAddressAndCoords: (addressFieldName: string, addressValue: string) => void;
  addressFieldName: string;
  latFieldName: string;
  lngFieldName: string;
}

const AddressSearchMap: React.FC<AddressSearchMapProps> = ({ setAddressAndCoords, addressFieldName, latFieldName, lngFieldName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [markerLayer, setMarkerLayer] = useState<any>(null); // 마커 레이어를 상태로 관리
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // ✅ 1. vworld 스크립트 로드
  // useEffect(() => {
  //   if (window.vworld) {
  //     setIsScriptLoaded(true);
  //     return;
  //   }

  //   const script = document.createElement('script');
  //   script.src = 'https://map.vworld.kr/js/vworldMapInit.js.do?apiKey=A6E1C7F8-A878-32F7-A607-D7B0B08C5576&domain=http://localhost:5173';
  //   script.async = true;
  //   script.onload = () => {
  //     console.log('✅ VWorld API 로드 완료');
  //     setIsScriptLoaded(true);

  //     // ol3 객체 준비될 때까지 체크
  //     const timer = setInterval(() => {
  //       console.log('dddddddddd');
  //       if (window.vw?.ol3?.Map && window.vw.ol3.BasemapType) {
  //         console.log('555555555555');
  //         clearInterval(timer);

  //         const ol3 = window.vw.ol3;

  //         const map = new ol3.Map(mapRef.current, {
  //           basemapType: ol3.BasemapType.GRAPHIC,
  //           controlDensity: ol3.DensityType.FULL,
  //           interactionDensity: ol3.DensityType.FULL,
  //           zoom: 8,
  //           center: [127.0276, 37.4979],
  //         });

  //         console.log('✅ 지도 생성 완료:', map);
  //       }
  //     }, 200);
  //   };
  //   script.onerror = () => console.error('❌ VWorld API 로드 실패');
  //   document.head.appendChild(script);
  // }, []);

  // ✅ 2. 로드 완료 후 지도 초기화
  // useEffect(() => {
  //   const vw = window.vw;
  //   console.log(window.vw);

  //   if (!vw) {
  //     console.error('vWorld SDK가 아직 로드되지 않았어요.');
  //     return;
  //   }

  //   // 지도 생성
  //   const map = new vw.Map('map', {
  //     basemapType: vw.BasemapType.GRAPHIC,
  //     controlDensity: vw.DensityType.FULL,
  //     interactionDensity: vw.DensityType.FULL,
  //     zoom: 8,
  //     center: [127.0276, 37.4979], // 강남 좌표
  //   });

  //   return () => {
  //     map.destroy();
  //   };
  // }, []);

  // 1. 주소 문자열을 좌표로 변환(Vworld 사용)
  // const geocodeAddress = async (addr: string) => {
  //   try {
  //     const payload = {
  //       address: addr,
  //     };

  //     const response = await axios.post('http://localhost:3000/map/geocode', payload, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     console.log(response);
  //     if (response.status === 200) {
  //       setAddress(addr);
  //       setAddressAndCoords(addressFieldName, addr);

  //       // // 기존 마커를 모두 제거
  //       // markerLayer.removeAllMarkers();

  //       // // 좌표계 변환: 백엔드 좌표(x, y)를 Vworld 지도 좌표계에 맞게 변환
  //       // const coords = new window.vw.ol2.Projection.transform(
  //       //   new window.vw.ol2.LonLat(lat, lng),
  //       //   'EPSG:4326', // 입력 좌표계 (위경도)
  //       //   map.getProjectionObject(), // 지도에 사용되는 좌표계 (예: EPSG:3857)
  //       // );

  //       // // 새로운 마커 옵션 생성
  //       // const newMarkerOption = {
  //       //   x: coords.lon,
  //       //   y: coords.lat,
  //       //   epsg: map.getProjectionObject().getCode(), // 'EPSG:3857'
  //       //   title: '검색된 위치',
  //       //   contents: addr,
  //       //   iconUrl: 'http://map.vworld.kr/images/ol2/marker_blue.png',
  //       // };

  //       // // 새로운 마커 생성 및 마커 레이어에 추가
  //       // const newMarker = new window.vw.ol2.Marker(newMarkerOption);
  //       // markerLayer.addMarker(newMarker);

  //       // // 지도의 중심을 마커 위치로 이동하고 확대
  //       // map.setCenter(coords, 16);
  //     }
  //   } catch (error) {
  //     console.log('지오코딩 에러, ', error);
  //   }
  // };

  // 2. 주소 검색 완료 핸들러
  const handleComplete = (data: any) => {
    setIsModalOpen(false);
    setAddress(data.address);
    // const { lat, lng } = response.data;

    setAddressAndCoords(addressFieldName, data.address);

    // geocodeAddress(data.address);
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
