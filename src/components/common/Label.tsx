import React from 'react';

// `props`의 타입을 명확하게 정의합니다.
interface LabelProps {
  htmlFor: string;
  LabelName: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, LabelName }) => {
  return (
    <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-900 dark:text-white'>
      {LabelName}
    </label>
  );
};

export default Label;
