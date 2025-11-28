import React, { useState } from 'react';
import FormCard from '../../components/common/FormCard';
import FindForm from '../../components/forms/FindForm';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { findIdSchema } from '../../validation/authSchema';
import LoadingOverlay from '../../components/common/LoadingOverlay';

type FormData = yup.InferType<typeof findIdSchema>;

const FindId: React.FC = () => {
  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    getValues, // 입력 필드 값을 가져오는 함수
    trigger, // 특정 필드의 유효성 검사를 수동으로 실행
    resetField, // 특정 필드 초기화하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(findIdSchema), // Yup 스키마를 리졸버로 연결
  });
  const [isLoading, setIsLoading] = useState(false);

  const inputsConfig = [
    {
      name: 'email',
      label: '이메일',
      type: 'email',
      placeholder: '이메일을 입력하세요.',
    },
  ];

  const buttonConfig = [
    {
      type: 'submit',
      label: '아이디 찾기',
      className: 'w-full',
    },
  ] as const;

  const [result, setResult] = useState<{ result: string } | null>(null);

  const handleFindId: SubmitHandler<FormData> = async () => {
    const email = getValues('email');
    try {
      setIsLoading(true);
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${baseURL}/user/find-id?email=${email}`);
      if (response.status === 200) {
        setResult({
          result: '아이디는 ' + response.data.id + '입니다.',
        });
      }
    } catch (error) {
      // console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setResult({
            result: error.response.data.message,
          });
        } else if (error.response.status === 404) {
          setResult({
            result: error.response.data.message,
          });
        } else if (error.response.status === 500) {
          setResult({
            result: '일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormCard title='아이디 찾기'>
      <LoadingOverlay isOverlay={true} isActive={isLoading} />
      <FindForm onSubmit={handleFindId} handleSubmit={handleSubmit} inputs={inputsConfig} buttons={buttonConfig} register={register} errors={errors} ResultProps={result} />
    </FormCard>
  );
};

export default FindId;
