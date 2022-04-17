import axios from "axios";
import {
  inviteApiURL,
  getAuthHeader,
  reactAppDevEnv,
  reactAppEnv,
  authApiURL,
} from "constants/defaultValues";

const targetAuthApiUrl =
  reactAppEnv === reactAppDevEnv ? `${authApiURL}/auth` : authApiURL;

export interface InviteFriendParams {
  username: string;
  destinationEmail: string;
}

const inviteApi = {
  inviteFriend: ({ username, destinationEmail }: InviteFriendParams) =>
    axios.post(
      `${inviteApiURL}/send-mail/reference-email`,
      {
        username,
        destination_email: destinationEmail,
      },
      { headers: getAuthHeader() }
    ),
  inviteEmailTemplateContent: () =>
    axios.get(`${targetAuthApiUrl}/template-invite-mail`, {
      headers: getAuthHeader(),
    }),
};

export default inviteApi;
