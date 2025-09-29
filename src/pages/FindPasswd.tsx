import React, { useState } from 'react';
import FormCard from '../components/common/FormCard';
import FindForm from '../components/forms/FindForm';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { findPasswdSchema } from '../validation/authSchema';

type FormData = yup.InferType<typeof findPasswdSchema>;

const FindPasswd: React.FC = () => {
  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    getValues, // 입력 필드 값을 가져오는 함수
    trigger, // 특정 필드의 유효성 검사를 수동으로 실행
    resetField, // 특정 필드 초기화하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(findPasswdSchema), // Yup 스키마를 리졸버로 연결
  });

  const inputsConfig = [
    {
      name: 'userId',
      label: '아이디',
      type: 'text',
      placeholder: '아이디를 입력하세요.',
    },
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
      label: '비밀번호 찾기',
      className: 'w-full',
    },
  ] as const;

  const [result, setResult] = useState<{ result: string } | null>(null);

  const handleFindPasswd: SubmitHandler<FormData> = async (data: FormData) => {
    const payload = {
      id: data.userId,
      email: data.email,
    };

    console.log(payload);

    try {
      const response = await axios.post('http://localhost:3000/user/reset-password', payload);
      console.log(response);
      if (response.status === 201) {
        setResult({
          result: '비밀번호 재등록 메일을 보냈습니다. \n메일함을 확인해주세요.',
        });
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          setResult({
            result: '해당 사용자가 없습니다.',
          });
        }
      }
    }
  };

  return (
    <>
      <FormCard title='비밀번호 찾기'>
        <FindForm onSubmit={handleFindPasswd} handleSubmit={handleSubmit} inputs={inputsConfig} buttons={buttonConfig} register={register} errors={errors} ResultProps={result} />
      </FormCard>
    </>
  );
};

export default FindPasswd;
