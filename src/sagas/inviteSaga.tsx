import { toast } from "react-toastify";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import { setIsOpenInviteFriend } from "reduxes/invite/action";
import {
  FETCH_INVITE_EMAIL_TEMPLATE,
  SEND_INVITE_FRIEND,
} from "reduxes/invite/constants";
import { SendInviteFriendPayload } from "reduxes/invite/type";
import { inviteApi } from "services";

function* handleSendInviteFriends(action: {
  type: string;
  payload: SendInviteFriendPayload;
}): any {
  const { inviteInfo } = action.payload;
  try {
    const sendInviteFriendResponse = yield call(
      inviteApi.inviteFriend,
      inviteInfo
    );

    if (sendInviteFriendResponse.error === false) {
      yield put({
        type: SEND_INVITE_FRIEND.SUCCEEDED,
      });

      yield toast.success(`Invitation has been sent.`);

      yield put(setIsOpenInviteFriend({ isOpen: false }));
    } else {
      yield put({
        type: SEND_INVITE_FRIEND.FAILED,
      });
      toast.error(
        sendInviteFriendResponse.message || "Unable to send invitation."
      );
    }
  } catch (e: any) {
    yield put({
      type: SEND_INVITE_FRIEND.FAILED,
    });
    toast.error(e.message);
  }
}

function* handleFetchInviteEmailTemplate(): any {
  try {
    const inviteEmailTemplateContentResponse = yield call(
      inviteApi.inviteEmailTemplateContent
    );

    if (inviteEmailTemplateContentResponse.error === false) {
      yield put({
        type: FETCH_INVITE_EMAIL_TEMPLATE.SUCCEEDED,
        payload: {
          content: inviteEmailTemplateContentResponse.data.content || "",
        },
      });
    } else {
      yield put({
        type: FETCH_INVITE_EMAIL_TEMPLATE.FAILED,
      });
    }
  } catch (e: any) {
    yield put({
      type: FETCH_INVITE_EMAIL_TEMPLATE.FAILED,
    });
  }
}

function* generateSaga() {
  yield takeEvery(SEND_INVITE_FRIEND.REQUESTED, handleSendInviteFriends);
  yield takeLatest(
    FETCH_INVITE_EMAIL_TEMPLATE.REQUESTED,
    handleFetchInviteEmailTemplate
  );
}

export default generateSaga;
