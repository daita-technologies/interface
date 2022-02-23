import { InviteFriendParams } from "services/inviteApi";

export interface InviteReducer {
  isOpenInviteFriendModal: boolean;
  isSendingFriendInvitation: boolean;
  isFetchingInviteEmailTemplate: boolean;
  inviteEmailTemplateContent: string | null;
}

export interface SetIsOpenInviteFriendPayload {
  isOpen: boolean;
}

export interface SendInviteFriendPayload {
  inviteInfo: InviteFriendParams;
}

export interface FetchInviteEmailTemplateSucceedPayload {
  content: string;
}
