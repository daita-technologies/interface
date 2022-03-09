import axios from "axios";
import { FeedbackSlackParam } from "components/FeedbackComponent/type";
import {
  apiWebHookSlack,
  channelSlackFeedback,
  ICON_EMOJI_DEFAULT,
  USER_NAME_BOT_DEFAULT,
} from "constants/defaultValues";

const uninterceptedAxiosInstance = axios.create();

const feedbackApi = {
  sendFeedbackToSlack: ({
    channel = channelSlackFeedback,
    text,
    username = USER_NAME_BOT_DEFAULT,
    icon_emoji = ICON_EMOJI_DEFAULT,
  }: FeedbackSlackParam) => {
    return uninterceptedAxiosInstance.post(
      apiWebHookSlack,
      JSON.stringify({
        channel,
        username,
        text,
        icon_emoji,
      }),
      {
        withCredentials: false,
        transformRequest: [
          (data, headers) => {
            delete headers.post["Content-Type"];
            return data;
          },
        ],
      }
    );
  },
};

export default feedbackApi;
