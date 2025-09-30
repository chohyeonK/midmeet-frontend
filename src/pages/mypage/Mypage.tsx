import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { mypageSchema } from '../../validation/authSchema';
import FormCard from '../../components/common/FormCard';
import MypageForm from '../../components/forms/MypageForm';

// 핵심 데이터: 실제 저장 데이터
interface UserData {
  uid: string;
  id: string;
  email: string;
  name: string;
  phone: string;
}

// 폼 유효성 검사용 스키마, form 타입
type FormData = yup.InferType<typeof mypageSchema>;
const getTokenFromStorage = () => localStorage.getItem('token') || null;

const Mypage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm<FormData>({
    resolver: yupResolver(mypageSchema),
    defaultValues: {
      email: '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
      userName: '',
      phoneNumber: '',
    },
  });

  const handleSaveUser: SubmitHandler<FormData> = async (data: FormData) => {
    const token = getTokenFromStorage();

    const passwordPayload = data.password
      ? {
          current_passwd: data.currentPassword,
          new_passwd: data.password,
        }
      : null;

    const payload = {
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
    };

    if (data.email) payload.email = data.email;
    if (data.userName) payload.name = data.userName;
    if (data.phoneNumber) payload.phone = '+82' + data.phoneNumber;

    if (token) {
      try {
        // 1. 비밀번호 변경 API 호출
        if (passwordPayload) {
          await axios.patch('http://localhost:3000/user/change-password', passwordPayload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // 2. 비밀번호 외 정보 업데이트 API 호출
        const response = await axios.patch('http://localhost:3000/user/user-info', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert('회원 정보가 수정되었습니다.');
          // 유저 상태 업데트
          updateUser(response.data.user);
        }
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 403) {
            alert('현재 비밀번호가 일치하지 않습니다.');
            setFocus('currentPassword');
          } else if (error.response.status === 402) {
            alert('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.');
          } else if (error.response.status === 500) {
            alert('일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.');
          }
        } else {
          alert('회원 정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        email: '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
        userName: '',
        phoneNumber: '',
      });
    }
  }, [user, reset]);

  // user가 null일 경우, 로딩 메시지를 반환합니다.
  if (!user) {
    return <div>회원 정보를 불러오는 중입니다...</div>;
  }

  return (
    <>
      <FormCard title='회원정보'>
        <MypageForm onSubmit={handleSaveUser} register={register} handleSubmit={handleSubmit} errors={errors} data={user} />{' '}
      </FormCard>
    </>
  );
};

export default Mypage;
