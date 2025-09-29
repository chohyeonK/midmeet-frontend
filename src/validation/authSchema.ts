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
