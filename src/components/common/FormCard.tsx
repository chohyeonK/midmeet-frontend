import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  return (
    <div className='flex flex-col items-center justify-center px-6 mx-auto'>
      <div className='flex mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>{title}</div>
      <div className='w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>{children}</div>
      </div>
    </div>
  );
};

export default FormCard;
