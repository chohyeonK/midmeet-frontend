import React, { useState, forwardRef } from 'react';
import Label from '../common/Label';
import Input from '../common/Input';
import PartyFormContainer from './PartyContainer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { setHours, setMinutes } from 'date-fns';
import Counter from './Counter';

interface StepFormData {
  name: string;
  date: Date | null;
  numberOfPeople: number;
}

interface StepFormProps {
  data: StepFormData;
  onUpdateFormData: (data: Partial<StepFormData>) => void;
  onUpdateCount: (newCount: number) => void;
}

const CustomDatePickerInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => (
  <input type='text' className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700' value={value} onClick={onClick} onChange={onChange} ref={ref} />
));

const StepForm: React.FC<StepFormProps> = ({ data, onUpdateFormData, onUpdateCount }) => {
  // const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  interface CustomDatePickerInputProps {
    value?: string;
    onClick?: () => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const handleDateChange = (date: Date | null) => {
    onUpdateFormData({ date });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateFormData({ name: e.target.value });
  };

  return (
    <>
      <div>
        <div className='flex items-center justify-between'>
          <Label htmlFor='partyName' LabelName='모임명' />
        </div>
        <div className='mt-2'>
          <Input name='partyName' type='text' value={data.name} onChange={handleNameChange} />
        </div>
      </div>
      <div>
        <div className='flex items-center justify-between'>
          <Label htmlFor='partyDate' LabelName='날짜 선택' />
        </div>
        <div className='mt-2 w-full'>
          <DatePicker
            selected={data.date}
            onChange={handleDateChange}
            dateFormat='yyyy년 MM월 dd일 h:mm aa'
            showTimeSelect
            timeFormat='h:mm aa'
            timeIntervals={15}
            timeCaption='시간'
            locale={ko}
            placeholderText='날짜와 시간을 선택하세요'
            customInput={<CustomDatePickerInput />}
          />
        </div>
      </div>
      <div>
        <div className='flex items-center justify-between'>
          <Label htmlFor='partyCount' LabelName='인원수' />
        </div>
        <div className='mt-2'>
          <Counter onUpdateCount={onUpdateCount} count={data.numberOfPeople} />
        </div>
      </div>
    </>
  );
};

export default StepForm;
