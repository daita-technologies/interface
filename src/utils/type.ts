import { TOKEN_LIST } from "constants/defaultValues";

export type TokenStorageName = typeof TOKEN_LIST[number];
export interface TokenStorageTypes {
  access_key: string;
  id_token: string;
  credential_token_expires_in: number;
  identity_id: string;
  secret_key: string;
  session_key: string;
  resfresh_token: string;
  token: string;
  token_expires_in: number;
}
