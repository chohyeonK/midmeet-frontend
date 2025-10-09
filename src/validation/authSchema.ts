import * as yup from 'yup';

export const phoneRegExp = /^(010)-?([0-9]{4})-?([0-9]{4})$/;

// 회원가입 스키마
export const signUpSchema = yup.object().shape({
  userId: yup.string().required('아이디는 필수 항목입니다.'),
  email: yup.string().email('올바른 이메일 형식이 아닙니다.').required('이메일은 필수 항목입니다.'),
  password: yup.string().min(8, '비밀번호는 8자 이상이어야 합니다.').required('비밀번호는 필수 항목입니다.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인은 필수 항목입니다.'),
  userName: yup.string().required('이름은 필수 항목입니다.').min(2, '이름은 2자 이상이어야 합니다.').max(10, '이름은 10자 이하여야 합니다.'),
  phoneNumber: yup.string().required('전화번호는 필수 항목입니다.').matches(phoneRegExp, '올바른 전화번호 형식이 아닙니다. (예: 01012345678)'),
});

// 로그인 스키마
export const loginSchema = yup.object().shape({
  userId: yup.string().required('아이디는 필수 항목입니다.'),
  password: yup.string().min(8, '비밀번호는 8자 이상이어야 합니다.').required('비밀번호는 필수 항목입니다.'),
});

// 마이페이지 - 회원정보 수정 스키마
export const mypageSchema = yup.object().shape({
  email: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .email('올바른 이메일 형식이 아닙니다.'),

  currentPassword: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),

  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),

  confirmPassword: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .when('password', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.').required(),
    }),

  userName: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(10, '이름은 10자 이하여야 합니다.'),

  phoneNumber: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .matches(phoneRegExp, '올바른 전화번호 형식이 아닙니다. (예: 01012345678)'),
});

// 아이디 찾기 스키마
export const findIdSchema = yup.object().shape({
  email: yup.string().email('올바른 이메일 형식이 아닙니다.').required('이메일은 필수 항목입니다.'),
});

// 비밀번호 찾기 스키마
export const findPasswdSchema = yup.object().shape({
  userId: yup.string().required('아이디는 필수 항목입니다.'),
  email: yup.string().email('올바른 이메일 형식이 아닙니다.').required('이메일은 필수 항목입니다.'),
});

// 비밀번호 찾기 스키마
export const resetPasswdSchema = yup.object().shape({
  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),

  confirmPassword: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .when('password', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.').required(),
    }),
});

// 폼 데이터 타입 정의
interface ParticipantFormData {
  from: string;
  transportation: 'public' | 'private' | '';
  // 출발지 주소 등이 있다면 여기에 추가
}

// 모임 시작 사용자 입력 스키마
export const partyJoinInputSchema = yup.object().shape({
  from: yup.string().required('주소를 입력해주세요.'),
  transportation: yup
    .mixed<ParticipantFormData['transportation']>() // Union Type 사용
    .oneOf(['public', 'private'], '교통 수단을 선택해 주세요.')
    .required('교통 수단은 필수 선택입니다.'),
});
