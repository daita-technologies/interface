import { FeedbackFieldProps } from "components/FeedbackComponent/type";

export interface FeedbackReducer {
  feedback: FeedbackFieldProps;
  status: FeedbackProcessingStatus;
}

export interface FeedbackProcessingStatus {
  isProcessing: boolean;
}

export interface FeedbackContentProps {
  content: string;
}
export interface FeedbackAttachedProps {
  attachedFiles: (File | null)[];
}
export interface DeleteFeedbackAttachedProps {
  index: number;
}
export interface UpdateFeedbackProcessingStatusProps {
  isProcessing: boolean;
}
