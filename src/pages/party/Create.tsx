import React, { forwardRef, useState } from 'react';
import CreatePartyForm from '../../components/forms/CreatePartyForm';
import PartyFormContainer from '../../components/party/PartyContainer';
import StepForm from '../../components/party/StepForm';
import StepMethod from '../../components/party/StepMethod';
import StepCours from '../../components/party/StepCourse';

interface Course {
  index: number;
  tag: string;
}

interface PartyFormData {
  name: string;
  date: Date | null;
  numberOfPeople: number;
  midpointMethod: string;
  courseList: Course[];
}

const Create: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PartyFormData>({
    name: '',
    date: null,
    numberOfPeople: 2,
    midpointMethod: 'custom', // custom: 사용자, ai: ai 지정
    courseList: [
      {
        index: 1,
        tag: '',
      },
    ],
  });

  const handlePrev = () => {
    console.log('이전 버튼 누름');
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    console.log('다음 버튼 누름', step, steps.length);

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
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

  const steps = [
    <StepForm onUpdateFormData={handleUpdateFormData} data={formData} onUpdateCount={handleUpdateCount} />,
    <StepMethod data={formData} onUpdateFormData={handleUpdateFormData} />,
    <StepCours />,
  ];

  const props = {
    step: step,
    totalSteps: steps.length,
    title: '모임 생성',
    onPrev: handlePrev,
    onNext: handleNext,
  };

  return (
    <>
      <PartyFormContainer {...props}>{steps[step]}</PartyFormContainer>
    </>
  );
};

export default Create;
