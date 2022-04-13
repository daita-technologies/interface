// import { toast } from "react-toastify";
import axios from "axios";
// @ts-ignore
import { Service } from "axios-middleware";
import { apiURL, getAuthHeader, projectApiUrl } from "constants/defaultValues";
import { removeListToken } from "utils/general";

import { VerifyFormInputs } from "routes/VerifyAccountPage/type";
import history from "routerHistory";
import store from "store";
import { LOG_OUT } from "reduxes/auth/constants";

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
    axios.post(`${apiURL}/user_login`, {
      username,
      password,
      captcha,
    }),
  register: ({ username, password, email, captcha }: RegisterParams) =>
    axios.post(`${apiURL}/user_signup`, {
      username: username.toLowerCase(),
      password,
      email,
      captcha,
    }),
  logout: () =>
    axios.post(`${apiURL}/user_logout`, {}, { headers: getAuthHeader() }),
  verify: (body: VerifyFormInputs) =>
    axios.post(`${apiURL}/auth_confirm`, body),
  getUserInfo: () =>
    axios.get(`${apiURL}/user/info`, { headers: getAuthHeader() }),
  updateUserInfo: (body: Object) =>
    axios.post(`${apiURL}/user/info/update`, body, {
      headers: getAuthHeader(),
    }),
  resendRegisterCode: (body: ResendRegisterCodeParams) =>
    axios.post(`${apiURL}/resend_confirmcode`, body),
  forgotPasswordRequest: ({ username, captcha }: ForgotPasswordRequestParams) =>
    axios.post(`${apiURL}/forgot_password`, { username, captcha }),
  forgotPasswordChange: ({
    username,
    password,
    confirmCode,
  }: ForgotPasswordChangeParams) =>
    axios.post(`${apiURL}/confirm_code_forgot_password`, {
      username,
      password,
      confirm_code: confirmCode,
    }),
  refreshToken: ({ username, refreshToken }: RefreshTokenParams) =>
    axios.post(`${apiURL}/refresh_token`, {
      username,
      refresh_token: refreshToken,
    }),
  loginSocial: (code: string) =>
    axios.post(`${projectApiUrl}/auth/credential`, {
      code,
    }),
};
export default authApi;
