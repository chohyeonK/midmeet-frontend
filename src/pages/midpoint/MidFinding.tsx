import React, { useEffect, useState } from 'react';
import MidFindingContainer from '../../components/midpoint/MidFindingContainer';
import Loading from '../../components/common/Loading';

const MidFinding: React.FC = () => {
  // 백엔드에서 모임 정보 받아야 함
  const [midProps, setMidProps] = useState({
    partyName: '안산팟',
    partyDate: '2025.11.10 오후 3시',
    midPoint: '경기도 부천시',
    // 코스 개수 => 전체 경로 반영 위해
    courseList: [
      {
        courseNo: 1,
        courseName: '미지정',
        selectedPlace: null,
      },
      {
        courseNo: 2,
        courseName: '미지정',
        selectedPlace: null,
      },
      {
        courseNo: 3,
        courseName: '미지정',
        selectedPlace: null,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 5000ms = 5초
    return () => clearTimeout(loadingTimer);
  }, []);

  if (isLoading) {
    return <Loading title='최적의 만남 장소를 분석하고 있습니다.' message='잠시만 기다려주세요!' />;
  }

  return (
    <>
      <MidFindingContainer {...midProps} />
    </>
  );
};

export default MidFinding;
