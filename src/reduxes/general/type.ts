import { S3Client } from "@aws-sdk/client-s3";

export interface GeneralReducer {
  isShow: boolean;
  message?: string;
  s3: S3Client | null;
  isCheckingApp: boolean;
  reloadRecaptchaTrigger: number;
}

export interface SetIsCheckingAppPayload {
  isChecking: boolean;
}

export interface SetIsShowPageLoadingPayload {
  isShow: boolean;
  message?: string;
}
