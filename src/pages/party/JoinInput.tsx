import React, { useState } from 'react';
import JoinForm from '../../components/forms/JoinForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { partyJoinInputSchema } from '../../validation/authSchema';
import axios from 'axios';
import { usePartyStore } from '../../store/usePartyStore';
import { useNavigate, useLocation } from 'react-router-dom';

type FormData = yup.InferType<typeof partyJoinInputSchema>;
const getTokenFromStorage = () => localStorage.getItem('token') || null;

const JoinInput: React.FC = () => {
  const partyId = usePartyStore((state) => state.partyId);
  const token = getTokenFromStorage();
  const navigate = useNavigate();
  const location = useLocation();
  const partyName = location.state?.partyName;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(partyJoinInputSchema),
  });

  const setAddressAndField = (addressFieldName: string, addressValue: string) => {
    setValue(addressFieldName as keyof FormData, addressValue, { shouldValidate: true }); // 주소만 폼에 저장
  };

  const handleJoinSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    // console.log('handleJoinSubmit => ', data);

    const payload = {
      transport_mode: data.transportation,
      start_address: data.from,
    };

    const baseURL = import.meta.env.VITE_API_URL;
    const response = await axios.post(`${baseURL}/party/${partyId}/participant`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log(response);
    if (response.status === 200) {
      navigate('/join/success');
    }
  };

  const formSubmitHandler = handleSubmit(handleJoinSubmit);

  return (
    <>
      <JoinForm title={partyName} subTitle='모임원 정보 입력하기' setAddressAndField={setAddressAndField} onSubmit={formSubmitHandler} register={register} errors={errors} />
    </>
  );
};

export default JoinInput;
