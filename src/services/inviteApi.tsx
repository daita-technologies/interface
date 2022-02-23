import axios from "axios";
import { inviteApiURL, getAuthHeader, apiURL } from "constants/defaultValues";

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
    axios.get(`${apiURL}/template-invite-mail`, {
      headers: getAuthHeader(),
    }),
};

export default inviteApi;
