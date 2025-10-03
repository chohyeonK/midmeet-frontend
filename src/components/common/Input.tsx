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
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // <- 추가
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
  value,
  onChange, // <- 비구조화
}: InputProps<TFieldValues>) => {
  const baseClasses =
    'border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

  const widthClass = isFullWidth ? 'w-full' : '';

  // register가 있을 때 반환하는 props (onChange, ref 등)를 받아옴
  const registerProps = register ? (register(name) as Record<string, any>) : {};

  // registerProps와 컴포넌트 전달 onChange 병합.
  // 우선순위: 컴포넌트로 전달된 onChange가 있으면 그걸 사용, 아니면 registerProps.onChange 사용
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type,
    id: name as string,
    placeholder,
    disabled,
    defaultValue,
    value,
    className: `${baseClasses} ${widthClass} ${className}`.trim(),
    ...registerProps, // ref, name, onBlur 등 react-hook-form props 포함
  };

  if (onChange) {
    inputProps.onChange = onChange; // override registerProps.onChange if provided
  }

  return (
    <>
      <input {...inputProps} />
      {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
    </>
  );
};

export default Input;
