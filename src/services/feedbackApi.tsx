import axios from "axios";
import { FeedbackSlackParam } from "components/FeedbackComponent/type";
import {
  feedbackSlackApiURL,
  getAuthHeader,
  ID_TOKEN_NAME,
  presignURLUploadFeedbackImageSlackApiURL,
} from "constants/defaultValues";
import { getLocalStorage } from "utils/general";

const uninterceptedAxiosInstance = axios.create();

export interface GetPresignURLUploadFeedbackImageParams {
  idToken?: string;
  filename: string;
}
export interface UploadFeedbackImageParams {
  file: File;
  presignURL: PresignURL;
}
export interface PresignURL {
  url: string;
  fields: Record<string, string>;
}
export interface GetPresignURLResponse {
  presign_url: PresignURL;
  s3_uri: string;
}
export interface PresignURLWithFileInfo {
  presignURLResponse: GetPresignURLResponse;
  file: File;
}
const feedbackApi = {
  sendFeedbackToSlack: ({ text, imageURLs }: FeedbackSlackParam) =>
    axios.post(
      `${feedbackSlackApiURL}`,
      {
        text,
        images: imageURLs,
      },
      {
        headers: getAuthHeader(),
      }
    ),
  getPresignURLUploadFeedbackImage: ({
    idToken,
    filename,
  }: GetPresignURLUploadFeedbackImageParams) =>
    axios.post(
      `${presignURLUploadFeedbackImageSlackApiURL}`,
      {
        id_token: idToken || getLocalStorage(ID_TOKEN_NAME),
        filename,
      },
      { headers: getAuthHeader() }
    ),
  uploadFeedbackImage: ({ file, presignURL }: UploadFeedbackImageParams) => {
    const formData = new FormData();
    Object.entries(presignURL.fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", file);
    return uninterceptedAxiosInstance.post(presignURL.url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default feedbackApi;
