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
  onSubmit: (content: FeedbackFields) => Promise<ResponseSubmitType>;
}

export interface FeedbackSlackParam {
  text: string;
  channel?: string;
  username?: string;
  icon_emoji?: String;
}
export interface FeedbackWidgetParam {
  style: React.CSSProperties;
  children: React.ReactNode;
  isShow: boolean;
}
