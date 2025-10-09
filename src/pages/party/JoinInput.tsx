import React from 'react';
import JoinForm from '../../components/forms/JoinForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { partyJoinInputSchema } from '../../validation/authSchema';

type FormData = yup.InferType<typeof partyJoinInputSchema>;

const JoinInput: React.FC = () => {
  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    getValues, // 입력 필드 값을 가져오는 함수
    trigger, // 특정 필드의 유효성 검사를 수동으로 실행
    resetField, // 특정 필드 초기화하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(partyJoinInputSchema),
  });
  const handleJoinSubmit: SubmitHandler<FormData> = (data: FormData) => {
    // 경도, 위도, 주소 보내야 함
    console.log('handleJoinSubmit => ', data);
  };
  return (
    <>
      <JoinForm title='모임명' subTitle='모임원 정보 입력하기' onSubmit={handleJoinSubmit} handleSubmit={handleSubmit} register={register} errors={errors} />
    </>
  );
};

export default JoinInput;
