import { FeedbackFields } from "components/FeedbackComponent/type";
import { RESET_FEEDBACK, SET_FEEDBACK } from "./constants";
import { FeedbackReducer } from "./type";

export const initFeedback: FeedbackFields = { content: "" };

const inititalState: FeedbackReducer = {
  content: initFeedback,
};
const feedbackReducer = (
  state = inititalState,
  action: any
): FeedbackReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case SET_FEEDBACK: {
      const content = payload as FeedbackFields;
      return {
        ...state,
        content,
      };
    }
    case RESET_FEEDBACK: {
      return {
        ...state,
        content: initFeedback,
      };
    }
    default:
      return state;
  }
};

export default feedbackReducer;
