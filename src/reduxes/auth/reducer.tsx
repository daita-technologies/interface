import { AxiosResponse } from "axios";
import { TEMP_LOCAL_USERNAME } from "constants/defaultValues";
import { getLocalStorage, getLocalToken } from "utils/general";
import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_REQUEST,
  GET_USER_INFO,
  LOGIN,
  LOGIN_ACCOUNT_NOT_VERIFY,
  LOG_OUT,
  REGISTER_USER,
  RESET_LOGIN_ACCOUNT_NOT_VERIFY,
  SET_IS_FORGOT_REQUEST_STEP,
  UPDATE_USER_INFO,
  VERIFY_ACCOUNT,
} from "./constants";
import { AuthReducer, SetIsForgotRequestPayload } from "./type";

const inititalState: AuthReducer = {
  userInfo: {
    username: getLocalStorage(TEMP_LOCAL_USERNAME) || "DAITA User",
  },
  token: getLocalToken(),
  isLogged: !!getLocalToken(),
  isLogging: false,
  isFormRequesting: false,
  isVerifying: false,
  isForgotRequestStep: true,
  isLoginAccountVerified: true,
};

const authReducer = (state = inititalState, action: any) => {
  const { payload, type: actionType } = action;

  switch (actionType) {
    case LOGIN.REQUESTED:
      return { ...state, isLogging: true };

    case LOGIN.SUCCEEDED: {
      const username = getLocalStorage(TEMP_LOCAL_USERNAME) || "";

      return {
        ...state,
        token: payload.token,
        isLogging: false,
        isLogged: true,
        userInfo: { username: username || inititalState.userInfo.username },
      };
    }
    case LOG_OUT.SUCCEEDED:
      return { ...state, userInfo: null, token: null, isLogged: false };

    case LOGIN.FAILED:
      return { ...state, isLogging: false };

    case GET_USER_INFO.SUCCEEDED:
      return { ...state, userInfo: payload.userInfo };
    case REGISTER_USER.REQUESTED:
    case UPDATE_USER_INFO.REQUESTED:
    case FORGOT_PASSWORD_CHANGE.REQUESTED:
    case FORGOT_PASSWORD_REQUEST.REQUESTED:
      return { ...state, isFormRequesting: true };
    case VERIFY_ACCOUNT.REQUESTED:
      return { ...state, isVerifying: true };
    case VERIFY_ACCOUNT.SUCCEEDED:
    case VERIFY_ACCOUNT.FAILED:
      return { ...state, isVerifying: false };
    case REGISTER_USER.SUCCEEDED:
      return { ...state, isFormRequesting: false, isSucceedRegister: true };
    case REGISTER_USER.FAILED:
    case UPDATE_USER_INFO.SUCCEEDED:
    case UPDATE_USER_INFO.FAILED:
    case FORGOT_PASSWORD_CHANGE.SUCCEEDED:
    case FORGOT_PASSWORD_CHANGE.FAILED:
    case FORGOT_PASSWORD_REQUEST.FAILED:
      return { ...state, isFormRequesting: false };

    case FORGOT_PASSWORD_REQUEST.SUCCEEDED:
      return { ...state, isFormRequesting: false, isForgotRequestStep: false };
    case SET_IS_FORGOT_REQUEST_STEP: {
      const { isForgotRequestStep } = payload as SetIsForgotRequestPayload;
      return { ...state, isForgotRequestStep };
    }
    case LOGIN_ACCOUNT_NOT_VERIFY:
      return { ...state, isLoginAccountVerified: false, isLogging: false };
    case RESET_LOGIN_ACCOUNT_NOT_VERIFY:
      return { ...state, isLoginAccountVerified: true };
    default:
      return state;
  }
};

export default authReducer;
