import { RootState } from "reduxes";

export const selectorS3 = (state: RootState) => state.generalReducer.s3;

export const selectorIsShow = (state: RootState) => state.generalReducer.isShow;

export const selectorIsCheckingApp = (state: RootState) =>
  state.generalReducer.isCheckingApp;

export const selectorReloadRecaptchaTrigger = (state: RootState) =>
  state.generalReducer.reloadRecaptchaTrigger;
