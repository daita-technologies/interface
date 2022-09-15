export interface FeedbackFields {
  content: string;
  attachedFiles?: File[];
}
export interface FeedbackFieldProps {
  content: string;
  attachedFiles: (File | null)[];
}
export const enum FeedbackFormAction {
  NO_ACTION,
  PROCESSING,
}
export interface ResponseSubmitType {
  action: FeedbackFormAction;
}
export interface FeedbackFormProps {
  style: React.CSSProperties;
  note?: string;
  onSubmit: (content: FeedbackFields) => Promise<ResponseSubmitType>;
}

export interface FeedbackSlackParam {
  text: string;
  imageURLs: string[];
}
export interface FeedbackWidgetParam {
  style: React.CSSProperties;
  children: React.ReactNode;
  isShow: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export interface UploadZoneProps {
  index: number;
}
export interface UploadZoneWapperProps {
  onChangeAttachedFile: (file: File[] | null) => void;
}
