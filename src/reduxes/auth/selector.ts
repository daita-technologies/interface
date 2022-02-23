import { RootState } from "reduxes";

export const selectorIsLogged = (state: RootState) =>
  state.authReducer.isLogged;

export const selectorIsFormRequesting = (state: RootState) =>
  state.authReducer.isFormRequesting;

export const selectorIsForgotRequestStep = (state: RootState) =>
  state.authReducer.isForgotRequestStep;

export const selectorUserInfo = (state: RootState) =>
  state.authReducer.userInfo;
