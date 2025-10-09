import React, { forwardRef, useState } from 'react';
import PartyFormContainer from '../../components/party/PartyContainer';
import StepForm from '../../components/party/StepForm';
import StepMethod from '../../components/party/StepMethod';
import StepCourse from '../../components/party/StepCourse';
import type { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { format, formatISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { usePartyStore } from '../../store/usePartyStore';

export interface Course {
  course_no: number;
  tag: string;
}

export interface PartyFormData {
  name: string;
  date: Date | null;
  numberOfPeople: number;
  midpointMethod: string;
  courseList: Course[];
}

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PartyFormData>({
    name: '',
    date: null,
    numberOfPeople: 2,
    midpointMethod: 'custom', // custom: 사용자, ai: ai 지정
    courseList: [
      {
        course_no: 1,
        tag: '',
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

  const onSubmit: SubmitHandler<PartyFormData> = async () => {
    try {
      const token = getTokenFromStorage();
      let formattedDate = null;
      if (formData.date) {
        formattedDate = format(formData.date, "yyyy-MM-dd'T'HH:mm:ss");
      }
      const partyPayload = {
        party_name: formData.name,
        participant_count: formData.numberOfPeople,
        date_time: formattedDate,
      };

      const partyResponse = await axios.post('http://localhost:3000/party', partyPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(partyResponse);

      if (partyResponse.status === 201) {
        // 공유 링크 저장
        const { party_id } = partyResponse.data;

        setParty(party_id);

        const coursePayload = {
          courses: formData.courseList,
        };

        // console.log(coursePayload);

        const courseResponse = await axios.post(`http://localhost:3000/party/${party_id}/course`, coursePayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(courseResponse);

        if (courseResponse.status === 200) {
          navigate('/party/success');
        }
      }
    } catch (error) {}
  };

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
      <PartyFormContainer {...props}>{steps[step]}</PartyFormContainer>
    </>
  );
};

export default Create;
