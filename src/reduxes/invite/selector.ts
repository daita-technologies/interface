import { RootState } from "reduxes";

export const selectorIsOpenInviteFriend = (state: RootState) =>
  state.inviteReducer.isOpenInviteFriendModal;

export const selectorIsSendingFriendInvitation = (state: RootState) =>
  state.inviteReducer.isSendingFriendInvitation;

export const selectorIsFetchingInviteEmailTemplate = (state: RootState) =>
  state.inviteReducer.isFetchingInviteEmailTemplate;

export const selectorForgotEmailTemplateContent = (state: RootState) =>
  state.inviteReducer.inviteEmailTemplateContent;
