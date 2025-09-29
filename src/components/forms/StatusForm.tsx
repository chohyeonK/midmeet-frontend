import React from 'react';
import { Link } from 'react-router-dom';

interface StatusProps {
  title: string;
  message: string;
  buttonText: string;
  linkTo: string;
}

const StatusForm: React.FC<StatusProps> = ({ title, message, buttonText, linkTo }) => {
  return (
    <div className='flex flex-col items-center justify-center px-6 py-12 mx-auto'>
      <div className='flex flex-col'>
        <div className='text-left text-2xl font-semibold text-gray-900 dark:text-white'>{title}</div>
        <div className='text-left mt-4 text-xl/6 text-gray-800 dark:text-gray-200' style={{ whiteSpace: 'pre-line' }}>
          {message}
        </div>
        <Link to={linkTo} className='mt-8 text-white bg-mint-500 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default StatusForm;
