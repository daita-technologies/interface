import {
  RELOAD_CAPTCHA,
  SET_IS_CHECKING_APP,
  SET_PAGE_LOADING,
} from "./constants";
import { SetIsCheckingAppPayload, SetIsShowPageLoadingPayload } from "./type";

export const setIsCheckingApp = (payload: SetIsCheckingAppPayload) => ({
  type: SET_IS_CHECKING_APP,
  payload,
});

export const setIsCheckingApp2 = () => ({
  type: SET_IS_CHECKING_APP,
});
export const reloadCaptcha = () => ({
  type: RELOAD_CAPTCHA,
});

export const setPageLoading = (payload: SetIsShowPageLoadingPayload) => ({
  type: SET_PAGE_LOADING,
  payload,
});
