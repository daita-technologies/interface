import { S3Client } from "@aws-sdk/client-s3";

export interface GeneralReducer {
  isShow: boolean;
  s3: S3Client | null;
  isCheckingApp: boolean;
}

export interface SetIsCheckingAppPayload {
  isChecking: boolean;
}
