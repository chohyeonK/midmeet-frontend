import React, { useState } from 'react';
import JoinForm from '../../components/forms/JoinForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { partyJoinInputSchema } from '../../validation/authSchema';
import axios from 'axios';
import { usePartyStore } from '../../store/usePartyStore';

type FormData = yup.InferType<typeof partyJoinInputSchema>;
const getTokenFromStorage = () => localStorage.getItem('token') || null;

// 좌표 저장할 State 타입 정의
interface StartCoordinates {
  lat: number | null;
  lng: number | null;
}

const JoinInput: React.FC = () => {
  const [coords, setCoords] = useState<StartCoordinates>({ lat: null, lng: null });
  const partyId = usePartyStore((state) => state.partyId);
  const token = getTokenFromStorage();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm<FormData>({
    resolver: yupResolver(partyJoinInputSchema),
  });

  const setAddressAndCoords = (addressFieldName: string, addressValue: string) => {
    setValue(addressFieldName as keyof FormData, addressValue, { shouldValidate: true }); // 주소만 폼에 저장
    // setCoords({ lat, lng }); // ✅ 좌표는 로컬 상태에 저장
  };

  const handleJoinSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log('handleJoinSubmit => ', data);
    console.log(coords);

    if (coords.lat !== null && coords.lng !== null) {
      const payload = {
        transport_mode: data.transportation,
        start_address: data.from,
      };

      console.log(payload);

      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${baseURL}/party/${partyId}/participant`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
    }
  };

  const formSubmitHandler = handleSubmit(handleJoinSubmit);

  return (
    <>
      <JoinForm title='모임명' subTitle='모임원 정보 입력하기' setAddressAndCoords={setAddressAndCoords} onSubmit={formSubmitHandler} register={register} errors={errors} />
    </>
  );
};

export default JoinInput;
