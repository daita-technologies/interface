import {
  ERROR_MESSAGE_ACCOUNT_NOT_VERIFY,
  TEMP_LOCAL_FULLNAME,
  TEMP_LOCAL_USERNAME,
} from "constants/defaultValues";
import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import { loginAccountNotVerify } from "reduxes/auth/actions";
import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_REQUEST,
  // GET_USER_INFO,
  LOGIN,
  LOG_OUT,
  REFRESH_TOKEN,
  REGISTER_USER,
  UPDATE_USER_INFO,
  VERIFY_ACCOUNT,
} from "reduxes/auth/constants";
import {
  ForgotPasswordChangePayload,
  ForgotPasswordRequestPayload,
  LoginPayload,
  RegisterPayload,
} from "reduxes/auth/type";
import { reloadCaptcha, setIsCheckingApp } from "reduxes/general/action";
import {
  GENERATE_S3_CLIENT,
  SET_PAGE_LOADING,
} from "reduxes/general/constants";
import history from "routerHistory";

import { authApi } from "services";
import { RefreshTokenParams } from "services/authApi";

import {
  setListToken,
  removeListToken,
  setLocalStorage,
  removeLocalStorage,
} from "utils/general";

// function* handleGetUserInfo(): any {
//   try {
//     const userInfoResponse = yield call(authApi.getUserInfo);

//     let userInfoResponse = returnuserInfoResponse(userInfoResponse);

//     if (!userInfoResponse.error) {
//       let userInfo = userInfoResponse.data;
//       yield put({ type: GET_USER_INFO.SUCCEEDED, payload: { userInfo } });
//     } else {
//       yield put({ type: GET_USER_INFO.FAILED });
//     }
//   } catch (e: any) {
//     yield put({ type: GET_USER_INFO.FAILED, payload: { message: e.message } });
//   }
// }

function* handleLogin(action: { type: string; payload: LoginPayload }): any {
  try {
    const { username, password, captcha } = action.payload;
    const loginResponse = yield call(authApi.login, {
      username,
      password,
      captcha,
    });

    if (loginResponse.error === false) {
      const token = loginResponse.data.token || "";
      const apiName = loginResponse.data.name;
      const apiUsername = loginResponse.data.username;

      if (token) {
        yield setListToken(loginResponse.data);
        yield setLocalStorage(
          TEMP_LOCAL_USERNAME,
          apiName || apiUsername || username
        );

        yield put({ type: LOGIN.SUCCEEDED, payload: loginResponse.data });
        yield put({ type: GENERATE_S3_CLIENT });
        // yield handleGetUserInfo();
      } else {
        yield put({
          type: LOGIN.FAILED,
        });
        toast.error(loginResponse.message || "Auth service is not available.");
      }
    } else {
      if (loginResponse.message === ERROR_MESSAGE_ACCOUNT_NOT_VERIFY) {
        yield put(loginAccountNotVerify());
      } else {
        toast.error(loginResponse.message || "Login failed.");
      }
      yield put({
        type: LOGIN.FAILED,
      });
    }
  } catch (e: any) {
    yield put({ type: LOGIN.FAILED });
    toast.error(e.message);
  }
}

function* handleRefreshToken(action: {
  type: string;
  payload: RefreshTokenParams;
}): any {
  try {
    const { username } = action.payload;
    const refreshResponse = yield call(authApi.refreshToken, action.payload);

    if (refreshResponse.error === false) {
      const token = refreshResponse.data.token || "";
      const apiName = refreshResponse.data.name;
      const apiUsername = refreshResponse.data.username;

      if (token) {
        yield setListToken(refreshResponse.data);
        yield setLocalStorage(TEMP_LOCAL_USERNAME, apiUsername || username);
        yield setLocalStorage(
          TEMP_LOCAL_FULLNAME,
          apiName || apiUsername || username
        );

        yield put({
          type: REFRESH_TOKEN.SUCCEEDED,
          payload: refreshResponse.data,
        });
        yield put({ type: GENERATE_S3_CLIENT });
        yield put(setIsCheckingApp({ isChecking: false }));
      } else {
        yield put({
          type: REFRESH_TOKEN.FAILED,
        });
        yield put({ type: LOG_OUT.SUCCEEDED });
        removeListToken();
        yield put(setIsCheckingApp({ isChecking: false }));
      }
    } else {
      yield put({
        type: REFRESH_TOKEN.FAILED,
      });
      yield put({ type: LOG_OUT.SUCCEEDED });
      removeListToken();
      yield put(setIsCheckingApp({ isChecking: false }));
    }
  } catch (e: any) {
    yield put({
      type: REFRESH_TOKEN.FAILED,
    });
    yield put({ type: LOG_OUT.SUCCEEDED });
    removeListToken();
    yield put(setIsCheckingApp({ isChecking: false }));
  }
}

function* handleLogout(): any {
  try {
    yield put({ type: SET_PAGE_LOADING, payload: { isShow: true } });
    const logoutResponse = yield call(authApi.logout);
    removeListToken();
    yield removeLocalStorage(TEMP_LOCAL_USERNAME);
    if (logoutResponse.error === false) {
      if (logoutResponse.data.code) {
        window.location.href = `https://auth.daita.tech/logout?client_id=4cpbb5etp3q7grnnrhrc7irjoa&logout_uri=http://localhost:3000`;
        return;
      }
    }
    yield put({ type: SET_PAGE_LOADING, payload: { isShow: false } });
    yield put({ type: LOG_OUT.SUCCEEDED, payload: {} });
  } catch (e: any) {
    yield removeLocalStorage(TEMP_LOCAL_USERNAME);
    yield put({ type: LOG_OUT.SUCCEEDED, payload: {} });
    yield put({ type: SET_PAGE_LOADING, payload: { isShow: false } });
  }
}

function* handleVerifyAccount(action: any): any {
  try {
    const { username } = action.payload.body;
    const verifyResponse = yield call(authApi.verify, action.payload.body);

    if (verifyResponse.error === false) {
      yield put({
        type: VERIFY_ACCOUNT.SUCCEEDED,
      });
      // toast.success(verifyResponse.message || "Verify account succeed.");
      toast.success("Email confirmed successfully.");

      history.push("/login", {
        username,
      });
    } else {
      yield put({
        type: VERIFY_ACCOUNT.FAILED,
      });
      toast.error(verifyResponse.message || "Verify account failed.");
    }
  } catch (e: any) {
    yield put({
      type: VERIFY_ACCOUNT.FAILED,
    });
    toast.error("Verify account failed.");
  }
}

function* handleRegister(action: {
  type: string;
  payload: RegisterPayload;
}): any {
  try {
    const { username, email } = action.payload;
    const registerResponse = yield call(authApi.register, action.payload);

    if (!registerResponse.error) {
      yield put({
        type: REGISTER_USER.SUCCEEDED,
      });
      toast.success(
        "You have successfully signed up. Please check your email."
      );
      history.push("/verify", { username, email });
    } else {
      yield put({
        type: REGISTER_USER.FAILED,
      });
      toast.error(registerResponse.message || "Register failed.");
    }
  } catch (e: any) {
    yield put({ type: REGISTER_USER.FAILED });
    toast.error(e.message);
  }
}

function* handleUpdateUser(action: any): any {
  try {
    const registerResponse = yield call(
      authApi.updateUserInfo,
      action.payload.body
    );

    if (!registerResponse.error) {
      yield put({
        type: UPDATE_USER_INFO.SUCCEEDED,
      });
      toast.error("Update succeed.");
    } else {
      yield put({
        type: UPDATE_USER_INFO.FAILED,
      });
      toast.error("Update failed.");
    }
  } catch (e: any) {
    yield put({
      type: UPDATE_USER_INFO.FAILED,
    });
    toast.error(e.message);
  }
}

function* handleForgotPasswordRequest(action: {
  type: string;
  payload: ForgotPasswordRequestPayload;
}): any {
  const { username } = action.payload;
  try {
    const forgotPasswordRequestResponse = yield call(
      authApi.forgotPasswordRequest,
      action.payload
    );
    if (forgotPasswordRequestResponse) {
      if (forgotPasswordRequestResponse.error === false) {
        yield put({
          type: FORGOT_PASSWORD_REQUEST.SUCCEEDED,
        });

        yield toast.success(
          `Code has been sent to your email associate with username: ${username}`
        );
      } else {
        yield put({
          type: FORGOT_PASSWORD_REQUEST.FAILED,
        });
        yield toast.error(
          forgotPasswordRequestResponse.message ||
            "Can not sent forgot password request."
        );
      }
    }
  } catch (e: any) {
    yield put({
      type: FORGOT_PASSWORD_REQUEST.FAILED,
    });
    toast.error("Can not sent forgot password request.");
  }
}

function* handleForgotPasswordChange(action: {
  type: string;
  payload: ForgotPasswordChangePayload;
}): any {
  const { username } = action.payload;

  try {
    const forgotPasswordChangeResponse = yield call(
      authApi.forgotPasswordChange,
      action.payload
    );

    if (!forgotPasswordChangeResponse.error) {
      yield put({
        type: FORGOT_PASSWORD_CHANGE.SUCCEEDED,
      });
      yield toast.success("Password has been changed.");
      yield history.push({
        pathname: "/login",
        state: {
          username,
        },
      });
    } else {
      yield put({
        type: FORGOT_PASSWORD_CHANGE.FAILED,
      });
      yield toast.error(
        forgotPasswordChangeResponse.message || "Unable to change password."
      );
    }
  } catch (e: any) {
    yield put({
      type: FORGOT_PASSWORD_CHANGE.FAILED,
    });
    toast.error(e.message);
  }
}
function* handleReloadCaptcha() {
  yield put(reloadCaptcha());
}
function* authSaga() {
  yield takeLatest(LOGIN.REQUESTED, handleLogin);
  yield takeLatest(REFRESH_TOKEN.REQUESTED, handleRefreshToken);
  yield takeLatest(LOG_OUT.REQUESTED, handleLogout);
  // yield takeLatest(GET_USER_INFO.REQUESTED, handleGetUserInfo);
  yield takeLatest(REGISTER_USER.REQUESTED, handleRegister);
  yield takeLatest(VERIFY_ACCOUNT.REQUESTED, handleVerifyAccount);
  yield takeLatest(UPDATE_USER_INFO.REQUESTED, handleUpdateUser);
  yield takeLatest(
    FORGOT_PASSWORD_REQUEST.REQUESTED,
    handleForgotPasswordRequest
  );
  yield takeLatest(
    FORGOT_PASSWORD_CHANGE.REQUESTED,
    handleForgotPasswordChange
  );
  yield takeLatest(LOGIN.FAILED, handleReloadCaptcha);
  yield takeLatest(REGISTER_USER.FAILED, handleReloadCaptcha);
  yield takeLatest(FORGOT_PASSWORD_REQUEST.FAILED, handleReloadCaptcha);
}

export default authSaga;
