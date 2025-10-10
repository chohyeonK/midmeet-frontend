// src/components/forms/MypageForm.tsx

import React from 'react';
import type { FieldErrors, SubmitHandler, UseFormReturn, UseFormWatch } from 'react-hook-form';
import * as yup from 'yup';
import { mypageSchema } from '../../validation/authSchema';
import Label from '../common/Label';
import Button from '../common/Button';
import Input from '../common/Input';

interface UserData {
  uid: string;
  id: string;
  email: string;
  name: string;
  phone: string;
}

type FormData = yup.InferType<typeof mypageSchema>;

interface MypageFormProps {
  onSubmit: SubmitHandler<FormData>;
  register: UseFormReturn<FormData>['register'];
  handleSubmit: UseFormReturn<FormData>['handleSubmit'];
  errors: FieldErrors<FormData>;
  data: UserData;
}

const MypageForm: React.FC<MypageFormProps> = ({ onSubmit, register, handleSubmit, errors, data }) => {
  return (
    <>
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userId' LabelName='아이디' />
          </div>
          <div className='mt-2'>
            <Input name='userId' type='text' disabled={true} value={data.id} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='email' LabelName='이메일' />
          </div>
          <div className='mt-2 flex items-center space-x-4'>
            <Input name='email' type='email' register={register} error={errors.email} placeholder={data.email} isFullWidth={false} className='grow-5' />
            <Button type='button' buttonName='인증' className='w-28 flex-shrink-0 bg-indigo-600' />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='currentPassword' LabelName='현재 비밀번호' />
          </div>
          <div className='mt-2'>
            <Input name='currentPassword' type='password' register={register} error={errors.currentPassword} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password' LabelName='비밀번호' />
          </div>
          <div className='mt-2'>
            <Input name='password' type='password' register={register} error={errors.password} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='confirmPassword' LabelName='비밀번호 재확인' />
          </div>
          <div className='mt-2'>
            <Input name='confirmPassword' type='password' register={register} error={errors.confirmPassword} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userName' LabelName='이름' />
          </div>
          <div className='mt-2'>
            <Input name='userName' type='text' register={register} error={errors.userName} placeholder={data.name} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='phoneNumber' LabelName='휴대폰번호' />
          </div>
          <div className='mt-2'>
            <Input name='phoneNumber' type='text' register={register} error={errors.phoneNumber} placeholder={data.phone.slice(3)} />
          </div>
        </div>
        <div className='flex items-center justify-between space-x-4'>
          <Button type='submit' buttonName='수정' className='grow w-full' />
        </div>
      </form>
    </>
  );
};

export default MypageForm;
