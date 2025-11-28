import React, { useState } from 'react';
import FormCard from '../../components/common/FormCard';
import FindForm from '../../components/forms/FindForm';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { resetPasswdSchema } from '../../validation/authSchema';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingOverlay from '../../components/common/LoadingOverlay';

type FormData = yup.InferType<typeof resetPasswdSchema>;

const ResetPasswd: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // "abcd1234"
  const navigate = useNavigate();

  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswdSchema), // Yup 스키마를 리졸버로 연결
  });
  const inputsConfig = [
    {
      name: 'password',
      label: '새로운 비밀번호',
      type: 'password',
      placeholder: '********',
    },
    {
      name: 'confirmPassword',
      label: '비밀번호 재확인',
      type: 'password',
      placeholder: '********',
    },
  ];

  const buttonConfig = [
    {
      type: 'submit',
      label: '비밀번호 변경',
      className: 'w-full',
    },
  ] as const;

  const [result, setResult] = useState<{ result: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPasswd: SubmitHandler<FormData> = async (data: FormData) => {
    const payload = {
      passwd: data.password,
    };

    try {
      setIsLoading(true);
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${baseURL}/auth/verify-reset?token=${token}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('비밀번호를 변경하였습니다.');
        navigate('/reset-passwd/success');
      }
    } catch (error) {
      // console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setResult({
            result: '토큰이 만료되었습니다.',
          });
        } else if (error.response.status === 410) {
          setResult({
            result: '이미 비밀번호를 변경하였습니다.',
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
    <FormCard title='비밀번호 변경'>
      <LoadingOverlay isOverlay={true} isActive={isLoading} />
      <FindForm onSubmit={handleResetPasswd} handleSubmit={handleSubmit} inputs={inputsConfig} buttons={buttonConfig} register={register} errors={errors} ResultProps={result} />
    </FormCard>
  );
};

export default ResetPasswd;
