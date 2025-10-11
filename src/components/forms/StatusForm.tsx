import React from 'react';
import { Link } from 'react-router-dom';

interface StatusProps {
  title: string;
  message: string;
  buttonText: string;
  topTitle?: string;
  linkTo: {
    pathname: string;
    state?: any;
  };
  url?: string | null;
}

const StatusForm: React.FC<StatusProps> = ({ topTitle, title, message, buttonText, linkTo, url }) => {
  return (
    <div className='flex flex-col items-center justify-center px-6 py-12 mx-auto'>
      <div className='flex flex-col'>
        {topTitle && <div className='text-left text-2xl font-semibold text-mint-500'>{topTitle}</div>}
        <div className='text-left text-2xl font-semibold text-gray-900 dark:text-white'>{title}</div>
        <div className='text-left mt-4 text-xl/6 text-gray-800 dark:text-gray-200' style={{ whiteSpace: 'pre-line' }}>
          {message}
        </div>
        {url ? (
          <div className='mt-4 p-4 border rounded-lg bg-white shadow-md w-full max-w-lg break-words'>
            <div className='text-sm text-gray-500 mb-2'>공유(복사)</div>
            <p className='text-indigo-600 font-medium break-words'>{url}</p>
          </div>
        ) : (
          <Link
            to={linkTo.pathname || '/'}
            state={linkTo.state}
            className='mt-8 text-white bg-mint-500 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default StatusForm;
