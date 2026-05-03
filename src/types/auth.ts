export interface UserI {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface SignUpDataI {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SignInDataI {
  email: string;
  password: string;
}

export interface ForgotPasswordDataI {
  email: string;
}

export interface VerifyResetCodeDataI {
  resetCode: string;
}

export interface ResetPasswordDataI {
  email: string;
  newPassword: string;
}

export interface AuthFieldErrorI {
  value?: string;
  msg: string;
  param: string;
  location?: string;
}

export interface AuthResponseI {
  message: string;
  token?: string;
  user?: UserI;
  errors?: AuthFieldErrorI;
  statusMsg?: string;
}
