import React from 'react';
import { useForm, type FieldError, type FieldErrors, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { signUpSchema } from '../../validation/authSchema';
import Label from '../common/Label';
import Input from '../common/Input';
import Button from '../common/Button';

type FormData = yup.InferType<typeof signUpSchema>;

interface SignupFormProps {
  // 폼 제출 핸들러 (부모로부터 받음)
  onSubmit: SubmitHandler<FormData>;
  // useForm에서 받은 값들을 그대로 전달받음
  register: UseFormReturn<FormData>['register'];
  handleSubmit: UseFormReturn<FormData>['handleSubmit'];
  errors: FieldErrors<FormData>;
  // 아이디 중복확인 함수 (부모로부터 받음)
  onUserIdCheck: () => void;
}

const SignUpForm: React.FC<SignupFormProps> = ({ onSubmit, onUserIdCheck, register, handleSubmit, errors }) => {
  return (
    <>
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userId' LabelName='아이디' />
          </div>
          <div className='mt-2 flex items-center space-x-4'>
            <Input name='userId' type='text' register={register} error={errors.userId} isFullWidth={false} className='grow-5' />
            <Button type='button' buttonName='중복확인' onClick={onUserIdCheck} className='w-28 flex-shrink-0 bg-indigo-600' />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='email' LabelName='이메일' />
          </div>
          <div className='mt-2'>
            <Input name='email' type='email' register={register} error={errors.email} />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userPasswd' LabelName='비밀번호' />
          </div>
          <div className='mt-2'>
            <Input name='password' type='password' placeholder='••••••••' register={register} error={errors.password} />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='confirmPassword' LabelName='비밀번호 재확인' />
          </div>
          <div className='mt-2'>
            <Input name='confirmPassword' type='password' placeholder='••••••••' register={register} error={errors.confirmPassword} />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='userName' LabelName='이름' />
          </div>
          <div className='mt-2'>
            <Input name='userName' type='text' placeholder='홍길동' register={register} error={errors.userName} />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='phoneNumber' LabelName='휴대폰번호' />
          </div>
          <div className='mt-2'>
            <Input name='phoneNumber' type='text' placeholder='01012345678' register={register} error={errors.phoneNumber} />
          </div>
        </div>

        <Button type='submit' buttonName='회원가입' className='w-full ' />
      </form>
    </>
  );
};

export default SignUpForm;
