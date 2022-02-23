import {
  SET_IS_OPEN_INVITE_FRIEND,
  SEND_INVITE_FRIEND,
  FETCH_INVITE_EMAIL_TEMPLATE,
} from "./constants";
import {
  FetchInviteEmailTemplateSucceedPayload,
  InviteReducer,
  SetIsOpenInviteFriendPayload,
} from "./type";

const inititalState: InviteReducer = {
  isOpenInviteFriendModal: false,
  isSendingFriendInvitation: false,
  isFetchingInviteEmailTemplate: false,
  inviteEmailTemplateContent: null,
};

const inviteReducer = (state = inititalState, action: any): InviteReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case SET_IS_OPEN_INVITE_FRIEND: {
      const { isOpen } = payload as SetIsOpenInviteFriendPayload;
      return {
        ...state,
        isOpenInviteFriendModal: isOpen,
      };
    }
    case SEND_INVITE_FRIEND.REQUESTED:
      return {
        ...state,
        isSendingFriendInvitation: true,
      };
    case SEND_INVITE_FRIEND.SUCCEEDED:
      return {
        ...state,
        isSendingFriendInvitation: false,
      };
    case SEND_INVITE_FRIEND.FAILED:
      return {
        ...state,
        isSendingFriendInvitation: false,
      };

    case FETCH_INVITE_EMAIL_TEMPLATE.REQUESTED:
      return {
        ...state,
        isFetchingInviteEmailTemplate: true,
        inviteEmailTemplateContent: null,
      };
    case FETCH_INVITE_EMAIL_TEMPLATE.SUCCEEDED: {
      const { content } = payload as FetchInviteEmailTemplateSucceedPayload;

      return {
        ...state,
        isFetchingInviteEmailTemplate: false,
        inviteEmailTemplateContent: content,
      };
    }
    case FETCH_INVITE_EMAIL_TEMPLATE.FAILED:
      return {
        ...state,
        isFetchingInviteEmailTemplate: false,
      };

    default:
      return state;
  }
};

export default inviteReducer;
