import React from 'react';
import Label from '../common/Label';
import Input from '../common/Input';
import Button from '../common/Button';
import type { FieldErrors, FieldValues, SubmitHandler, UseFormRegister, UseFormHandleSubmit } from 'react-hook-form';
import type { findIdSchema } from '../../validation/authSchema';
import * as yup from 'yup';

type FormData = yup.InferType<typeof findIdSchema>;

interface InputConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
}

interface ButtonConfig {
  type: 'submit' | 'button' | 'reset';
  label: string;
  className?: string;
  method?: () => void;
}

interface ResultProps {
  type: 'id' | 'password';
  result: string;
}

interface FindFormProps<T extends FieldValues> {
  inputs: InputConfig[];
  buttons: readonly ButtonConfig[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onSubmit: SubmitHandler<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  ResultProps?: ResultProps | null;
}

const FindForm = <T extends FieldValues>({ inputs, buttons, register, errors, onSubmit, handleSubmit, ResultProps }: FindFormProps<T> & { handleSubmit: UseFormHandleSubmit<T> }) => {
  return (
    <>
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        {inputs.map((input, index) => (
          <div key={index}>
            <div className='flex items-center justify-between'>
              <Label htmlFor={input.name} LabelName={input.label} />
            </div>
            <div className='mt-2'>
              <Input name={input.name as any} type={input.type} placeholder={input.placeholder} register={register as any} error={errors[input.name as keyof T] as any} />
            </div>
          </div>
        ))}
        <div className='flex items-center justify-between space-x-4'>
          {buttons.map((button, index) => (
            <Button key={index} buttonName={button.label} type={button.type} onClick={button.method} className={button.className} />
          ))}
        </div>
      </form>

      {ResultProps && (
        <>
          <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700' />
          <div className='p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400' role='alert'>
            <span className='font-medium' style={{ whiteSpace: 'pre-line' }}>
              {ResultProps.result}
            </span>
          </div>
          <div></div>
        </>
      )}
    </>
  );
};

export default FindForm;
