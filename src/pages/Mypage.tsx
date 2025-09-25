import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { mypageSchema } from '../validation/authSchema';
import FormCard from '../components/common/FormCard';
import MypageForm from '../components/forms/MypageForm';

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
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors }, // 유효성 검사 에러 객체
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(mypageSchema), // Yup 스키마를 리졸버로 연결
    defaultValues: {
      email: '', // 새 이메일은 비워둠
      password: '',
      confirmPassword: '',
      userName: user?.name || '',
      phoneNumber: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: '',
        password: '',
        confirmPassword: '',
        userName: '',
        phoneNumber: '',
      });
    }
  }, [user, reset]);

  const handleSignup: SubmitHandler<FormData> = async (data: FormData) => {
    const token = getTokenFromStorage();
    const payload = {
      email: data.email,
      name: data.userName,
      phone: '+82' + data.phoneNumber,
    };

    console.log(payload);
    if (token) {
      try {
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
        alert('회원 정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // user가 null일 경우, 로딩 메시지를 반환합니다.
  if (!user) {
    return <div>회원 정보를 불러오는 중입니다...</div>;
  }

  return (
    <>
      <FormCard title='회원정보'>
        <MypageForm onSubmit={handleSignup} register={register} handleSubmit={handleSubmit} errors={errors} data={user} />{' '}
      </FormCard>
    </>
  );
};

export default Mypage;
