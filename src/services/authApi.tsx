// import { toast } from "react-toastify";
import axios from "axios";
// @ts-ignore
import { Service } from "axios-middleware";
import {
  getAuthHeader,
  authApiURL,
  reactAppDevEnv,
  reactAppEnv,
} from "constants/defaultValues";
import { removeListToken } from "utils/general";

import { VerifyFormInputs } from "routes/VerifyAccountPage/type";
import history from "routerHistory";
import store from "store";
import { LOG_OUT } from "reduxes/auth/constants";

const targetAuthApiUrl =
  reactAppEnv === reactAppDevEnv ? `${authApiURL}/auth` : authApiURL;

export interface LoginParams {
  username: string;
  password: string;
  captcha: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email: string;
  captcha: string;
}
export interface ResendRegisterCodeParams {
  username: string;
}

export interface ForgotPasswordRequestParams {
  username: string;
  captcha: string;
}

export interface ForgotPasswordChangeParams {
  username: string;
  password: string;
  confirmCode: string;
}

export interface RefreshTokenParams {
  username: string;
  refreshToken: string;
}

const service = new Service(axios);

service.register({
  onResponse(response: any) {
    if (response && typeof response.data === "string") {
      const apiData = JSON.parse(response.data);

      if (
        apiData.error &&
        apiData.message &&
        apiData.message.indexOf("expired") > -1
      ) {
        store.dispatch({ type: LOG_OUT.SUCCEEDED });
        removeListToken();
        if (window.location.pathname !== "/login") {
          setTimeout(() => {
            history.push("/login");
          }, 1000);
        }
      }

      return apiData;
    }

    return response;
  },
  onResponseError(error: any) {
    if (error) {
      if (error.response) {
        if (
          error.response.status === 401 &&
          error.response.statusText === "Unauthorized"
        ) {
          removeListToken();
          store.dispatch({ type: LOG_OUT.SUCCEEDED });
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
      //  else {
      // toast.error(error.message);
      // }
    }
    return error;
  },
});

const authApi = {
  login: ({ username, password, captcha }: LoginParams) =>
    axios.post(`${targetAuthApiUrl}/user_login`, {
      username,
      password,
      captcha,
    }),
  register: ({ username, password, email, captcha }: RegisterParams) =>
    axios.post(`${targetAuthApiUrl}/user_signup`, {
      username: username.toLowerCase(),
      password,
      email,
      captcha,
    }),
  logout: () =>
    axios.post(
      `${targetAuthApiUrl}/user_logout`,
      {},
      { headers: getAuthHeader() }
    ),
  verify: (body: VerifyFormInputs) =>
    axios.post(`${targetAuthApiUrl}/auth_confirm`, body),
  getUserInfo: () =>
    axios.get(`${targetAuthApiUrl}/user/info`, { headers: getAuthHeader() }),
  updateUserInfo: (body: Object) =>
    axios.post(`${targetAuthApiUrl}/user/info/update`, body, {
      headers: getAuthHeader(),
    }),
  resendRegisterCode: (body: ResendRegisterCodeParams) =>
    axios.post(`${targetAuthApiUrl}/resend_confirmcode`, body),
  forgotPasswordRequest: ({ username, captcha }: ForgotPasswordRequestParams) =>
    axios.post(`${targetAuthApiUrl}/forgot_password`, { username, captcha }),
  forgotPasswordChange: ({
    username,
    password,
    confirmCode,
  }: ForgotPasswordChangeParams) =>
    axios.post(`${targetAuthApiUrl}/confirm_code_forgot_password`, {
      username,
      password,
      confirm_code: confirmCode,
    }),
  refreshToken: ({ username, refreshToken }: RefreshTokenParams) =>
    axios.post(`${targetAuthApiUrl}/refresh_token`, {
      username,
      refresh_token: refreshToken,
    }),
  loginSocial: (code: string) =>
    axios.post(`${targetAuthApiUrl}/credential`, {
      code,
    }),
};

export default authApi;
