import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { mypageSchema } from '../../validation/authSchema';
import FormCard from '../../components/common/FormCard';
import MypageForm from '../../components/forms/MypageForm';
import BeatLoader from 'react-spinners/BeatLoader';

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
  const token = getTokenFromStorage();
  const { user, updateUser } = useAuthStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleVerifyEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const paylod = {
        email: email,
      };
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${baseURL}/user/change-email`, paylod, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        alert(response.data.message);
      }
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
      alert('시스템 에러가 발생하였습니다. 재로그인하여 다시 시도해주세요.');
    }
  };

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
          const baseURL = import.meta.env.VITE_API_URL;
          await axios.patch(`${baseURL}/user/change-password`, passwordPayload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // 2. 비밀번호 외 정보 업데이트 API 호출
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await axios.patch(`${baseURL}/user/user-info`, payload, {
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
        // console.log(error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 412) {
            alert('현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
            setFocus('currentPassword');
          } else if (error.response.status === 411) {
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

      setIsInitialLoading(false);
    }
  }, [user, reset]);

  // if (isLoading || isInitialLoading) {
  //   return (
  //     <div className='absolute inset-0 bg-gray-500/50 flex justify-center items-center z-40 rounded-lg'>
  //       <BeatLoader color='#00c48c' loading={true} size={30} aria-label='Loading Spinner' data-testid='loader' />
  //     </div>
  //   );
  // }

  // // user가 null일 경우, 로딩 메시지를 반환합니다.
  // if (!user) {
  //   return <div>회원 정보를 불러오는 중입니다...</div>;
  // }

  return (
    <>
      <div className='relative min-h-screen'>
        <FormCard title='회원정보'>
          {isLoading && (
            <div className='fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50'>
              {/* 💡 2. 로딩 아이콘: 투명도 적용 없이 흰색 배경 위에 보이도록 */}
              <BeatLoader
                color='#00c48c' // 로더 색상
                loading={true}
                size={30}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            </div>
          )}
          <MypageForm onSubmit={handleSaveUser} register={register} handleSubmit={handleSubmit} handleEmail={handleVerifyEmail} errors={errors} data={user} />
        </FormCard>
      </div>
    </>
  );
};

export default Mypage;
