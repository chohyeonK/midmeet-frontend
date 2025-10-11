import React, { useRef, useState, type BaseSyntheticEvent } from 'react';
import Label from '../common/Label';
import Input from '../common/Input';
import Button from '../common/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type FieldErrors, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import { partyJoinInputSchema } from '../../validation/authSchema';
import AddressSearchMap from '../party/AddressSearchMap';

type FormData = yup.InferType<typeof partyJoinInputSchema>;
// type SetAddressAndCoords = (addressFieldName: string, addressValue: string, lat: number, lng: number);

interface JoinFormProps {
  title: string;
  subTitle: string;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  register: UseFormReturn<FormData>['register'];
  errors: FieldErrors<FormData>;
  setAddressAndField: (addressFieldName: string, addressValue: string) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ onSubmit, register, errors, setAddressAndField }) => {
  return (
    <div className='flex flex-col items-center py-12 px-4'>
      <form onSubmit={onSubmit} className='w-full sm:max-w-md space-y-6 text-left'>
        <h1 className='text-3xl font-bold mb-6 text-mint-500'>모임명</h1>
        <h1 className='text-2xl font-bold mb-6'>모임원 정보 입력하기</h1>

        <div className='space-y-2'>
          {/* <Label htmlFor='from' LabelName='출발지 입력' />
          <div className='flex'>
            <Input type='text' name='from' placeholder='시/군/구 (예: 서울 강남구)' register={register} error={errors.from} isFullWidth={false} className='grow-5 mr-3' />
            <Button type='button' buttonName='검색' className='w-28 flex-shrink-0 bg-indigo-600' onClick={handleModalOpen} />
          </div>
          <div ref={mapRef} className='w-full h-64 bg-gray-200 rounded-lg border'></div> */}
          <AddressSearchMap setAddressAndField={setAddressAndField} addressFieldName='from' latFieldName='startLatitude' lngFieldName='startLongitude' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='transportation' LabelName='교통수단' />
          <select
            id='transportation'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            {...register('transportation')}
          >
            <option value=''>교통수단을 선택해주세요.</option>
            <option value='PUBLIC'>대중교통</option>
            <option value='PRIVATE'>자가</option>
          </select>
          {errors.transportation && <p className='text-red-500 text-sm mt-1'>{errors.transportation.message}</p>}
        </div>

        <div className='flex justify-end'>
          <Button type='submit' buttonName='완료' />
        </div>
      </form>
    </div>
  );
};

export default JoinForm;
