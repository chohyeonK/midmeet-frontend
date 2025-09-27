import React from 'react';

// `props`의 타입을 명확하게 정의합니다.
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'; // type은 세 가지 값 중 하나를 가질 수 있습니다.
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // 클릭 이벤트의 타입을 지정합니다.
  buttonName: string;
  className?: string; // className은 선택적인 문자열입니다.
}

const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, buttonName, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center rounded-md bg-mint-500 px-3 py-1.5 text-sm font-semibold text-white py-2 px-4 shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
    >
      {buttonName}
    </button>
  );
};

export default Button;
