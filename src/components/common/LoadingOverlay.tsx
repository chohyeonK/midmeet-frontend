import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface LoadingOverlayProps {
  isOverlay?: boolean;
  isActive: boolean;
  size?: number;
  color?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isOverlay = true, isActive, size = 30, color = '#00c48c' }) => {
  if (!isActive) {
    return null;
  }
  const overlayClasses = isOverlay ? 'fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50' : 'flex justify-center items-center'; // 오버레이가 아닐 때는 중앙 정렬만 유지
  return (
    <>
      <div className={overlayClasses} style={isOverlay ? {} : { width: '100%', height: '100%' }}>
        <BeatLoader
          color={color}
          loading={true} // 이 컴포넌트가 렌더링되면 항상 로딩 중
          size={size}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      </div>
    </>
  );
};

export default LoadingOverlay;
