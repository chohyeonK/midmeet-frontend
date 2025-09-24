import type { UseFormRegister, FieldValues, FieldError, Path } from 'react-hook-form';

// `Input` 컴포넌트가 받을 props의 타입을 정의합니다.
// 제네릭을 사용하여 폼 데이터의 타입(TFieldValues)을 유연하게 처리합니다.
interface InputProps<TFieldValues extends FieldValues> {
  type: string;
  name: Path<TFieldValues>; // 폼 데이터의 키값만 허용
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError; // react-hook-form의 FieldError 타입을 사용
  className?: string; // className prop을 추가
  isFullWidth?: boolean;
}

// React.FC에 제네릭 타입을 명시하여 props 타입을 정확하게 전달합니다.
const Input = <TFieldValues extends FieldValues>({ type, name, placeholder, register, error, className = '', isFullWidth = true }: InputProps<TFieldValues>) => {
  const baseClasses =
    'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

  // `isFullWidth`가 true일 때만 'w-full'을 추가
  const widthClass = isFullWidth ? 'w-full' : '';
  return (
    <>
      <input
        {...register(name)}
        type={type}
        id={name as string} // id 속성으로 사용하기 위해 string으로 캐스팅
        placeholder={placeholder}
        className={`${baseClasses} ${widthClass} ${className}`}
      />
      {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
    </>
  );
};

export default Input;
