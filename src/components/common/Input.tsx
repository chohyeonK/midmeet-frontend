// src/components/common/Input.tsx

import React from 'react';
import type { UseFormRegister, FieldValues, FieldError, Path } from 'react-hook-form';

interface InputProps<TFieldValues extends FieldValues> {
  type: string;
  name: Path<TFieldValues>;
  placeholder?: string;
  register?: UseFormRegister<TFieldValues>;
  error?: FieldError;
  className?: string;
  isFullWidth?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  value?: string | number; // <-- value prop을 받도록 수정했습니다.
}

const Input = <TFieldValues extends FieldValues>({
  type,
  name,
  placeholder,
  register,
  error,
  className = '',
  isFullWidth = true,
  disabled = false,
  defaultValue,
  value, // <-- value prop을 받습니다.
}: InputProps<TFieldValues>) => {
  const baseClasses =
    'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

  const widthClass = isFullWidth ? 'w-full' : '';

  const registerProps = register ? register(name) : {};

  return (
    <>
      <input
        {...registerProps}
        type={type}
        id={name as string}
        placeholder={placeholder}
        className={`${baseClasses} ${widthClass} ${className}`}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value} // <-- value prop을 연결합니다.
      />
      {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
    </>
  );
};

export default Input;
