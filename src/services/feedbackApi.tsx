import axios from "axios";
import { FeedbackSlackParam } from "components/FeedbackComponent/type";
import { getAuthHeader, projectApiUrl } from "constants/defaultValues";

const uninterceptedAxiosInstance = axios.create();

const feedbackApi = {
  sendFeedbackToSlack: ({ text }: FeedbackSlackParam) => {
    return uninterceptedAxiosInstance.post(
      `${projectApiUrl}/webhook/client-feedback`,
      JSON.stringify({
        text,
      }),
      {
        withCredentials: false,
        transformRequest: [
          (data, headers) => {
            delete headers.post["Content-Type"];
            return data;
          },
        ],
        headers: getAuthHeader(),
      }
    );
  },
};

export default feedbackApi;
