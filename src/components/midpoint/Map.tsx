import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import type { Point } from '../../types/MidCommonTypes';
import L from 'leaflet';

// 마커 클래스
const createCustomMarkerIcon = (type: 'midpoint' | 'selected', order?: number) => {
  const typeClass = type === 'midpoint' ? 'midpoint-marker-style' : 'selected-marker-style';

  let htmlContent;
  let className;
  let iconSize: [number, number];
  let iconAnchor: [number, number];

  if (order !== undefined) {
    // 장소 마커 (순번 O)
    htmlContent = `
      <div class="marker-pin ${typeClass}">
        <span class="marker-number">${order}</span>
      </div>
    `;
    className = 'custom-map-marker numbered-marker';
    iconSize = [36, 36];
    iconAnchor = [18, 36]; // 아래 중앙
  } else {
    // 중간 지점 마커 (순번 X)
    htmlContent = `
      <div class="marker-pin ${typeClass}"></div>
    `;
    className = 'custom-map-marker plain-marker';
    iconSize = [24, 24];
    iconAnchor = [12, 12];
  }

  return L.divIcon({
    className: className,
    html: htmlContent,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
  });
};

interface MapProps {
  points: Point[];
  initialCenter?: [number, number];
}

const Map: React.FC<MapProps> = ({ points, initialCenter }) => {
  const MapViewAdjuster = () => {
    const map = useMap();
    const markerCoordinates: [number, number][] = points.map((p) => [p.lat, p.lng]);

    useEffect(() => {
      if (markerCoordinates.length > 0) {
        const bounds = L.latLngBounds(markerCoordinates);

        map.fitBounds(bounds, {
          padding: [5, 5],
          maxZoom: 16, // 최대 줌 레벨 제한
        });
      }
    }, [points, map]); // points Prop이 변경될 때마다 재실행

    return null;
  };

  const center: [number, number] = initialCenter || (points.length > 0 ? [points[0].lat, points[0].lng] : [37.5, 127.0]);

  return (
    <>
      <MapContainer center={center} zoom={13} style={{ height: '350px', width: '100%', zIndex: 0 }}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />

        {points.length > 0 && <MapViewAdjuster />}

        {points.map((point) => {
          let iconToUse;
          iconToUse = createCustomMarkerIcon(point.type, point.index);

          // 고유 ID (lat/lng 조합)를 사용하여 key 충돌 방지
          const markerKey = `${point.type}-${point.lat}-${point.lng}-${point.index}`;

          return (
            <Marker key={markerKey} position={[point.lat, point.lng]} icon={iconToUse}>
              <Popup>{point.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default Map;
