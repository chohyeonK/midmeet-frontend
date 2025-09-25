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
// MypageFormProps 인터페이스에서 data 속성을 제거했습니다.
interface MypageFormProps {
  onSubmit: SubmitHandler<FormData>;
  register: UseFormReturn<FormData>['register'];
  handleSubmit: UseFormReturn<FormData>['handleSubmit'];
  errors: FieldErrors<FormData>;
  data: UserData; // <-- UserData를 받습니다.
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
            {/* watch를 사용해 값을 가져오고, disabled로 수정 불가능하게 만듭니다. */}
            <Input name='userId' type='text' disabled={true} value={data.id} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='currentEmail' LabelName='현재 이메일' />
          </div>
          <div className='mt-2'>
            <Input name='currentEmail' type='email' disabled={true} value={data.email} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='email' LabelName='새 이메일' />
          </div>
          <div className='mt-2 flex items-center space-x-4'>
            <Input name='email' type='email' register={register} error={errors.email} isFullWidth={false} className='grow-5' />
            <Button type='button' buttonName='인증' className='w-28 flex-shrink-0 bg-indigo-600' />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password' LabelName='새 비밀번호' />
          </div>
          <div className='mt-2'>
            <Input name='password' type='password' register={register} error={errors.password} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='confirmPassword' LabelName='비밀번호 재확인' />
          </div>
          <div className='mt-2 flex items-center space-x-4'>
            <Input name='confirmPassword' type='password' register={register} error={errors.confirmPassword} isFullWidth={false} className='grow-5' />
            <Button type='button' buttonName='수정' className='w-28 flex-shrink-0 bg-indigo-600' />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='currentUserName' LabelName='현재 이름' />
          </div>
          <div className='mt-2'>
            <Input name='currentUserName' type='text' disabled={true} value={data.name} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userName' LabelName='새 이름' />
          </div>
          <div className='mt-2'>
            <Input name='userName' type='text' register={register} error={errors.userName} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='currentPhoneNumber' LabelName='현재 휴대폰번호' />
          </div>
          <div className='mt-2'>
            <Input name='currentPhoneNumber' type='text' disabled={true} value={data.phone} />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='phoneNumber' LabelName='새 휴대폰번호' />
          </div>
          <div className='mt-2'>
            <Input name='phoneNumber' type='text' register={register} error={errors.phoneNumber} />
          </div>
        </div>
        <div className='flex items-center justify-between space-x-4'>
          <Button type='button' buttonName='취소' className='grow text-black bg-white border border-gray-300 ' />
          <Button type='submit' buttonName='수정' className='grow' />
        </div>
      </form>
    </>
  );
};

export default MypageForm;
