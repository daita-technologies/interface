import {
  DELETE_FEEDBACK_ATTACHMENT,
  RESET_FEEDBACK,
  SET_FEEDBACK_ATTACHMENT,
  SET_FEEDBACK_CONTENT,
  UPDATE_FEEDBACK_PROCESSING_STATUS,
} from "./constants";
import {
  DeleteFeedbackAttachedProps,
  FeedbackAttachedProps,
  FeedbackContentProps,
  UpdateFeedbackProcessingStatusProps,
} from "./type";

export const setFeedBackContent = (payload: FeedbackContentProps) => ({
  type: SET_FEEDBACK_CONTENT,
  payload,
});
export const setFeedBackAttachment = (payload: FeedbackAttachedProps) => ({
  type: SET_FEEDBACK_ATTACHMENT,
  payload,
});
export const deleteFeedBackAttachment = (
  payload: DeleteFeedbackAttachedProps
) => ({
  type: DELETE_FEEDBACK_ATTACHMENT,
  payload,
});
export const resetFeedBack = () => ({
  type: RESET_FEEDBACK,
});
export const updateFeedbackProcessingStatus = (
  payload: UpdateFeedbackProcessingStatusProps
) => ({
  type: UPDATE_FEEDBACK_PROCESSING_STATUS,
  payload,
});
