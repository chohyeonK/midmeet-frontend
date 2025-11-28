import React from 'react';
import LoadingOverlay from './LoadingOverlay';

interface LoadingProps {
  title: string;
  message: string;
}

const Loading: React.FC<LoadingProps> = ({ title, message }) => {
  return (
    <div className='flex flex-col items-center justify-center px-6 py-12 mx-auto'>
      <div className='flex flex-col mb-6'>
        <div className='text-left text-2xl font-semibold text-mint-500'>{title}</div>
        <div className='text-left text-2xl font-semibold text-gray-900 dark:text-white'>{message}</div>
      </div>
      <LoadingOverlay isOverlay={false} isActive={true} />
    </div>
  );
};

export default Loading;
