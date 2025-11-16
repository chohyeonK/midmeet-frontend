import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import type { Point } from '../../types/MidCommonTypes';
import L from 'leaflet';

const createMidpointIconWithoutNumber = (type: 'midpoint' | 'selected') => {
  const typeClass = type === 'midpoint' ? 'midpoint-marker-style' : 'selected-marker-style';

  const htmlContent = `
        <div class="marker-pin ${typeClass}"></div>
    `;

  return L.divIcon({
    className: 'custom-map-marker plain-marker', // 일반 마커 스타일 클래스
    html: htmlContent,
    iconSize: [24, 24],
    iconAnchor: [12, 12], // 중앙에 위치
  });
};

const createNumberedIcon = (order: number, type: 'midpoint' | 'selected') => {
  const isMidpoint = type === 'midpoint';

  // CSS 클래스를 동적으로 설정하여 색상을 구분합니다.
  const baseClass = 'custom-map-marker numbered-marker';
  const typeClass = isMidpoint ? 'midpoint-marker-style' : 'selected-marker-style';

  // HTML 내부에 순서 번호(order)를 삽입합니다.
  const htmlContent = `
        <div class="marker-pin ${typeClass}">
            <span class="marker-number">${order}</span>
        </div>
    `;

  return L.divIcon({
    className: baseClass, // 기본 스타일만 적용
    html: htmlContent,
    iconSize: [36, 36], // 아이콘 크기 확장
    iconAnchor: [18, 36], // 마커 핀처럼 보이도록 앵커를 아래로 조정 (중앙이 아닌 바닥 중앙)
  });
};

// 🟦 중간 지점 마커 (예: 파란색 원형)
const MidpointIcon = L.divIcon({
  className: 'custom-map-marker midpoint-marker-style', // 👈 CSS 클래스 지정
  html: '<div />', // 비어있는 <div>를 사용하여 순수 CSS로 모양 만듦
  iconSize: [24, 24],
  iconAnchor: [12, 12], // 중심점을 중앙에 맞춥니다.
});

// 🟥 사용자가 선택한 장소 마커 (예: 빨간색 원형 또는 사각형)
const SelectedIcon = L.divIcon({
  className: 'custom-map-marker selected-marker-style', // 👈 다른 CSS 클래스 지정
  html: '<div />',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// 테스트 데이터 (이전 답변에서 사용된 서울역-강남역 경로 예시)
const TEST_DATA = {
  encodedPolyline: 'wcrkFw`cj@p@_@?f@?z@k@?_@?g@?i@?g@?_@?{@g@??',
  startCoords: [37.555907, 126.972382] as [number, number], // 튜플로 명시
  endCoords: [37.498177, 127.027588] as [number, number], // 튜플로 명시
  initialCenter: [37.527, 126.9999] as [number, number],
};

// Polyline 디코딩 함수
const decodeRoute = (encodedString: string): [number, number][] => {
  if (!encodedString) return [];
  const decodedCoordinates = polyline.decode(encodedString) as [number, number][];
  return decodedCoordinates;
};

const pathCoordinates = decodeRoute(TEST_DATA.encodedPolyline) as [number, number][];

interface MapProps {
  // 📌 외부에서 받을 좌표 데이터 배열
  points: Point[];
  // 추가: 지도의 초기 중심 좌표를 설정할 수도 있습니다. (선택 사항)
  initialCenter?: [number, number];
}

const Map: React.FC<MapProps> = ({ points, initialCenter }) => {
  const MapViewAdjuster = () => {
    // MapContainer의 자식 컴포넌트이므로 useMap을 사용할 수 있습니다.
    const map = useMap();
    const markerCoordinates: [number, number][] = points.map((p) => [p.lat, p.lng]);

    useEffect(() => {
      if (markerCoordinates.length > 0) {
        // 1. Leaflet Bounds 객체 생성
        const bounds = L.latLngBounds(markerCoordinates);

        // 2. 뷰 조정 실행 (더 확대하려면 padding 값을 줄이세요)
        map.fitBounds(bounds, {
          padding: [5, 5],
          maxZoom: 16, // 최대 줌 레벨 제한
        });
      }
    }, [points, map]); // points Prop이 변경될 때마다 재실행

    return null;
  };
  const center: [number, number] = initialCenter || (points.length > 0 ? [points[0].lat, points[0].lng] : [37.5, 127.0]);
  const initialZoom = 13; // 초기 줌 레벨은 13으로 설정
  let courseOrder = 0;

  return (
    <>
      <MapContainer center={center} zoom={13} style={{ height: '350px', width: '100%' }}>
        {/* TileLayer */}
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />

        {/* (선택 사항) 테스트 Polyline */}
        {/* <Polyline positions={pathCoordinates} color="red" /> */}

        {/* 📌 MapViewAdjuster 내부 컴포넌트 렌더링 */}
        {points.length > 0 && <MapViewAdjuster />}

        {/* 📌 props로 받은 points 배열을 바로 렌더링에 사용 */}
        {points.map((point, index) => {
          let iconToUse;

          if (point.type === 'selected') {
            // 1. 'course' 타입인 경우에만 순서 카운트 증가
            courseOrder += 1;

            // 2. 순서 번호를 사용하여 아이콘 생성
            // createNumberedIcon 함수는 이전 답변에서 정의한 함수를 사용합니다.
            iconToUse = createNumberedIcon(courseOrder, point.type);
          } else if (point.type === 'midpoint') {
            // 3. 'midpoint' 타입인 경우
            //   - 번호를 매기지 않고, 이전 답변에서 정의했던 MidpointIcon을 사용하거나
            //   - 번호 없는 특별한 아이콘을 사용합니다.
            // 예시: 번호가 없는 아이콘 함수를 새로 정의하거나,
            //       숫자 없이 배경색만 가진 아이콘 함수를 사용합니다.
            // 여기서는 임시로 0을 전달하여 번호 없는 중간 지점 아이콘을 만듭니다.
            iconToUse = createMidpointIconWithoutNumber(point.type); // 👈 2-1 참고
          }

          // 만약 points에 없는 type이 들어오면 기본 SelectedIcon을 사용합니다.
          if (!iconToUse) {
            iconToUse = SelectedIcon;
          }

          return (
            <Marker key={`${point.type}-${index}`} position={[point.lat, point.lng]} icon={iconToUse}>
              <Popup>{point.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default Map;
