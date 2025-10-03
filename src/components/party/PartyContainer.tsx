import React from 'react';
import Button from '../common/Button';

interface PartyFormProps {
  step: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
}

const PartyFormContainer: React.FC<PartyFormProps> = ({ step, totalSteps, title, children, onPrev, onNext }) => {
  const isLastStep = step === totalSteps - 1;
  return (
    <>
      <div className='flex flex-col items-center justify-center px-6 mx-auto max-w-sm sm:max-w-2xl'>
        <div className='w-full'>
          <div className='text-left mb-6 text-2xl font-semibold text-gray-900'>{title}</div>
        </div>

        <div className='w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          {/* <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>{children}</div> */}
          {children}
        </div>

        <div className='flex justify-end w-full'>
          {onPrev && step !== 0 && <Button buttonName='이전' onClick={onPrev} className='bg-white !text-black mr-4' />}
          {isLastStep ? <Button buttonName='완료' onClick={onNext} /> : <Button buttonName='다음' onClick={onNext} />}
        </div>
      </div>
    </>
  );
};

export default PartyFormContainer;
