import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import PartyFormContainer from '../../components/party/PartyContainer';
import StepForm from '../../components/party/StepForm';
import StepMethod from '../../components/party/StepMethod';
import StepCourse from '../../components/party/StepCourse';
import type { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { usePartyStore } from '../../store/usePartyStore';
import { FILTER_CATEGORIES } from '../../data/filterCategory';
import LoadingOverlay from '../../components/common/LoadingOverlay';

type CategoryKeys = keyof typeof FILTER_CATEGORIES;

export type TransformedTagData = {
  category: CategoryKeys | null;
  primaryQueries: string[];
  secondaryFilters: string[];
};

export interface Course {
  course_id: number;
  course_no: number;
  tag: TransformedTagData | null;
}

export interface PartyFormData {
  name: string;
  date: Date | null;
  numberOfPeople: number;
  midpointMethod: string;
  courseList: Course[];
}

export const emptyTagData: TransformedTagData = {
  category: null,
  primaryQueries: [],
  secondaryFilters: [],
};

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const Create: React.FC = () => {
  const UNLOAD_MESSAGE = '페이지를 벗어나면 입력한 내용이 사라질 수 있습니다. 계속하시겠습니까?';
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PartyFormData>({
    name: '',
    date: null,
    numberOfPeople: 2,
    midpointMethod: 'CUSTOM_COURSE',
    courseList: [
      {
        course_id: Date.now(),
        course_no: 1,
        tag: emptyTagData,
      },
    ],
  });
  const setParty = usePartyStore((state) => state.setPartyId);

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleNext = (data: Partial<PartyFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleUpdateFormData = (data: Partial<PartyFormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handleUpdateCount = (newCount: number) => {
    setFormData((prevData) => ({ ...prevData, numberOfPeople: newCount }));
  };

  const isTagDataEmpty = (tag: TransformedTagData | null): boolean => {
    if (!tag || !tag.category) {
      return true;
    }

    // primaryQueries와 secondaryFilters 배열이 모두 비어있으면 비어있음
    if (tag.primaryQueries.length === 0 && tag.secondaryFilters.length === 0) {
      return true;
    }

    // 태그가 하나라도 있으면 false (비어있지 않음)
    return false;
  };
  const onSubmit: SubmitHandler<PartyFormData> = async () => {
    try {
      setIsLoading(true);
      if (!formData.name.trim()) {
        alert('모임명을 입력해주세요.');
        return;
      }

      if (!formData.date) {
        alert('모임 날짜를 선택해주세요.');
        return;
      }

      // 코스 목록 유효성 검사(태그가 최소 1개 이상인지)
      const isAnyCourseTagEmpty = formData.courseList.some((course) => {
        return isTagDataEmpty(course.tag);
      });

      if (isAnyCourseTagEmpty) {
        alert('모든 코스에 최소 1개 이상의 태그를 지정해야 합니다.');
        return;
      }

      const token = getTokenFromStorage();
      let formattedDate = null;
      if (formData.date) {
        formattedDate = format(formData.date, "yyyy-MM-dd'T'HH:mm:ss");
      }
      const partyPayload = {
        party_name: formData.name,
        participant_count: formData.numberOfPeople,
        date_time: formattedDate,
        party_type: formData.midpointMethod,
      };

      // console.log(formData);

      const baseURL = import.meta.env.VITE_API_URL;
      const partyResponse = await axios.post(`${baseURL}/party`, partyPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (partyResponse.status === 200) {
        // 공유 링크 저장
        const { party_id } = partyResponse.data;

        setParty(party_id);

        const coursePayload = {
          courses: formData.courseList,
        };

        const baseURL = import.meta.env.VITE_API_URL;
        const courseResponse = await axios.post(`${baseURL}/party/${party_id}/course`, coursePayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (courseResponse.status === 200) {
          navigate('/party/success');
        }
      }
    } catch (error) {
      // console.log(error);
      // 이메일 인증 안받은 유저가 모임 생성 시 에러 처리
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
        }
      } else {
        alert('저장하는데 오류가 발생하였습니다. 다시 시도하여 주시기 바랍니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    // 1. 모임명 필터
    if (formData.name.trim() !== '') return true;

    // 2. 날짜 필터
    if (formData.date !== null) return true;

    // 3. 코스가 1개 이상 추가된 경우
    if (formData.courseList.length > 1) return true;

    // 4. 코스가 1개만 있을 경우: 첫 번째 코스의 태그가 비어있지 않은지 확인
    // 코스 목록이 비어있지 않고 (length >= 1) 첫 번째 코스가 존재할 때만 검사
    if (formData.courseList.length === 1) {
      const firstCourseTag = formData.courseList[0].tag;

      // isTagDataEmpty 함수를 재활용하여 태그가 비어있지 않으면 true 반환
      // isTagDataEmpty는 null이거나 객체 내부 배열이 비었을 때 true를 반환함
      return !isTagDataEmpty(firstCourseTag);
    }

    return false; // 변경 사항 없음
  }, [formData]);

  // 브라우저 이벤트 핸들러
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        // 이 코드를 설정하면 브라우저가 기본 경고창을 띄웁니다.
        event.returnValue = UNLOAD_MESSAGE;
        return UNLOAD_MESSAGE;
      }
    },
    [hasUnsavedChanges],
  ); // hasUnsavedChanges가 변경될 때마다 핸들러가 재생성됩니다.

  // 1. 차단 조건 (boolean 값)을 명확히 정의
  const shouldBlock = hasUnsavedChanges();

  // 2. 차단 로직 (콜백 함수) 정의
  const blockerCallback = useCallback(
    (blocker: any) => {
      // blocker: Blocker 타입이 필요합니다.
      const confirmResult = window.confirm(UNLOAD_MESSAGE);

      if (confirmResult) {
        // 사용자가 "확인"을 누름: 페이지 이동 허용
        blocker.proceed();
      } else {
        // 사용자가 "취소"를 누름: 네비게이션 중단
        blocker.reset();
      }
    },
    [], // UNLOAD_MESSAGE는 상수이므로 의존성 배열은 비워둡니다.
  );

  // ✅ useBlocker 호출: boolean 조건(shouldBlock)과 콜백 함수(blockerCallback)를 전달합니다.
  // useBlocker(shouldBlock, blockerCallback);

  // ✅ 해결: 옵션 객체 없이 호출
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]); // 이 패턴이 가장 안전하고 정확합니다.

  const steps = [
    <StepForm onUpdateFormData={handleUpdateFormData} data={formData} onUpdateCount={handleUpdateCount} />,
    <StepMethod data={formData} onUpdateFormData={handleUpdateFormData} />,
    <StepCourse data={formData} onUpdateFormData={handleUpdateFormData} />,
  ];

  const props = {
    step: step,
    totalSteps: steps.length,
    title: '모임 생성',
    onPrev: handlePrev,
    onNext: handleNext,
    onSubmit: onSubmit,
  };

  return (
    <>
      <PartyFormContainer {...props}>
        <LoadingOverlay isOverlay={true} isActive={isLoading} />
        {steps[step]}
      </PartyFormContainer>
    </>
  );
};

export default Create;
