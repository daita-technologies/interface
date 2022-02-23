import { RefreshTokenParams } from "services/authApi";
import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_REQUEST,
  LOGIN,
  REFRESH_TOKEN,
  REGISTER_USER,
  SET_IS_FORGOT_REQUEST_STEP,
} from "./constants";
import {
  ForgotPasswordRequestPayload,
  ForgotPasswordChangePayload,
  LoginPayload,
  RegisterPayload,
} from "./type";

export const loginAction = (payload: LoginPayload) => ({
  type: LOGIN.REQUESTED,
  payload,
});

export const registerAction = (payload: RegisterPayload) => ({
  type: REGISTER_USER.REQUESTED,
  payload,
});

export const forgotPasswordChange = (payload: ForgotPasswordChangePayload) => ({
  type: FORGOT_PASSWORD_CHANGE.REQUESTED,
  payload,
});

export const forgotPasswordRequest = (
  payload: ForgotPasswordRequestPayload
) => ({
  type: FORGOT_PASSWORD_REQUEST.REQUESTED,
  payload,
});

export const setIsForgotRequestStep = (payload: {
  isForgotRequestStep: boolean;
}) => ({
  type: SET_IS_FORGOT_REQUEST_STEP,
  payload,
});

export const refreshTokenRequest = (payload: RefreshTokenParams) => ({
  type: REFRESH_TOKEN.REQUESTED,
  payload,
});
