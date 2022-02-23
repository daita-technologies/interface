import { asyncAction } from "utils/general";

export const LOGIN = asyncAction("LOGIN");
export const LOG_OUT = asyncAction("LOG_OUT");
export const GET_USER_INFO = asyncAction("GET_USER_INFO");
export const REGISTER_USER = asyncAction("REGISTER_USER");
export const VERIFY_ACCOUNT = asyncAction("VERIFY_ACCOUNT");
export const UPDATE_USER_INFO = asyncAction("UPDATE_USER_INFO");

export const SET_IS_FORGOT_REQUEST_STEP = "SET_IS_FORGOT_REQUEST_STEP";
export const FORGOT_PASSWORD_REQUEST = asyncAction("FORGOT_PASSWORD_REQUEST");
export const FORGOT_PASSWORD_CHANGE = asyncAction("FORGOT_PASSWORD_CHANGE");

export const REFRESH_TOKEN = asyncAction("REFRESH_TOKEN");
