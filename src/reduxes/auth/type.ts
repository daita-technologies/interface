export interface LoginPayload {
  username: string;
  password: string;
  captcha: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  captcha: string;
}

export interface UserInfoType {
  username: string;
  fullname: string;
}
export interface AuthReducer {
  userInfo: UserInfoType;
  token: string | null;
  isLogged: boolean;
  isLogging: boolean;
  isFormRequesting: boolean;
  isVerifying: boolean;
  isForgotRequestStep: boolean;
  isLoginAccountVerified: boolean;
}

export interface ForgotPasswordRequestPayload {
  username: string;
  captcha: string;
}

export interface ForgotPasswordChangePayload {
  username: string;
  password: string;
  confirmCode: string;
}

export interface SetIsForgotRequestPayload {
  isForgotRequestStep: boolean;
}
