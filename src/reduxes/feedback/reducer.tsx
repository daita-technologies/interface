import { FeedbackFieldProps } from "components/FeedbackComponent/type";
import { MAX_NUM_FEEDBACK_ATTACHED_FILE } from "constants/defaultValues";
import _ from "lodash";
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
  FeedbackReducer,
  UpdateFeedbackProcessingStatusProps,
} from "./type";

export const initFeedback: FeedbackFieldProps = {
  content: "",
  attachedFiles: _.times(MAX_NUM_FEEDBACK_ATTACHED_FILE, _.constant(null)),
};

const inititalState: FeedbackReducer = {
  feedback: initFeedback,
  status: { isProcessing: false },
};
const feedbackReducer = (
  state = inititalState,
  action: any
): FeedbackReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case SET_FEEDBACK_CONTENT: {
      const { content } = payload as FeedbackContentProps;
      return {
        ...state,
        feedback: { ...state.feedback, content },
      };
    }
    case SET_FEEDBACK_ATTACHMENT: {
      const { attachedFiles } = payload as FeedbackAttachedProps;
      return {
        ...state,
        feedback: { ...state.feedback, attachedFiles },
      };
    }
    case DELETE_FEEDBACK_ATTACHMENT: {
      const { index } = payload as DeleteFeedbackAttachedProps;
      const { attachedFiles } = state.feedback;
      const newAttachedFiles = [
        ...attachedFiles.slice(0, index),
        ...attachedFiles.slice(index + 1, attachedFiles.length),
        null,
      ];
      return {
        ...state,
        feedback: { ...state.feedback, attachedFiles: newAttachedFiles },
      };
    }
    case RESET_FEEDBACK: {
      return {
        ...state,
        feedback: initFeedback,
      };
    }
    case UPDATE_FEEDBACK_PROCESSING_STATUS: {
      const { isProcessing } = payload as UpdateFeedbackProcessingStatusProps;
      return {
        ...state,
        status: {
          ...state.status,
          isProcessing,
        },
      };
    }
    default:
      return state;
  }
};

export default feedbackReducer;
