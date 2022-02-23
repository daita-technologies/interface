import {
  FETCH_INVITE_EMAIL_TEMPLATE,
  SEND_INVITE_FRIEND,
  SET_IS_OPEN_INVITE_FRIEND,
} from "./constants";
import { SendInviteFriendPayload, SetIsOpenInviteFriendPayload } from "./type";

export const setIsOpenInviteFriend = (
  payload: SetIsOpenInviteFriendPayload
) => ({ type: SET_IS_OPEN_INVITE_FRIEND, payload });

export const sendInviteFriend = (payload: SendInviteFriendPayload) => ({
  type: SEND_INVITE_FRIEND.REQUESTED,
  payload,
});

export const fetchInviteEmailTemplate = () => ({
  type: FETCH_INVITE_EMAIL_TEMPLATE.REQUESTED,
});
