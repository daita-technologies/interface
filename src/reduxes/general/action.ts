import { SET_IS_CHECKING_APP } from "./constants";
import { SetIsCheckingAppPayload } from "./type";

export const setIsCheckingApp = (payload: SetIsCheckingAppPayload) => ({
  type: SET_IS_CHECKING_APP,
  payload,
});

export const setIsCheckingApp2 = () => ({
  type: SET_IS_CHECKING_APP,
});
