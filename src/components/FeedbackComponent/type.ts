export interface FeedbackFields {
  content: string;
}
export const enum ACTION_FEEDBACK_FORM {
  NO_ACTION,
  PROCESSING,
}
export interface ResponseSubmitType {
  action: ACTION_FEEDBACK_FORM;
}
export interface FeedbackFormProps {
  style: React.CSSProperties;
  note?: string;
  feedback: FeedbackFields;
  onSubmit: (content: FeedbackFields) => Promise<ResponseSubmitType>;
  onContentChange?: (content: FeedbackFields) => void;
}

export interface FeedbackSlackParam {
  text: string;
}
export interface FeedbackWidgetParam {
  style: React.CSSProperties;
  children: React.ReactNode;
  isShow: boolean;
  onClose?: () => void;
}
