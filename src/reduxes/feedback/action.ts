import { FeedbackFields } from "components/FeedbackComponent/type";
import { RESET_FEEDBACK, SET_FEEDBACK } from "./constants";

export const setFeedBack = (payload: FeedbackFields) => ({
  type: SET_FEEDBACK,
  payload,
});
export const resetFeedBack = () => ({
  type: RESET_FEEDBACK,
});
