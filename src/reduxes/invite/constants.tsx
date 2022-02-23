import { asyncAction } from "utils/general";

export const SET_IS_OPEN_INVITE_FRIEND = "SET_IS_OPEN_INVITE_FRIEND";

export const SEND_INVITE_FRIEND = asyncAction("SEND_INVITE_FRIEND");
export const FETCH_INVITE_EMAIL_TEMPLATE = asyncAction(
  "FETCH_INVITE_EMAIL_TEMPLATE"
);
