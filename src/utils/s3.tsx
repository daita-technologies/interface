import {
  ACCESS_KEY_NAME,
  SECRET_KEY_NAME,
  SESSION_TOKEN_NAME,
} from "constants/defaultValues";
import { S3Client } from "@aws-sdk/client-s3";
import { getLocalStorage } from "utils/general";
import { S3_REGION } from "constants/s3Values";

const generateS3Client = () => {
  const ACCESS_KEY = getLocalStorage(ACCESS_KEY_NAME) || "";
  const SECRET_ACCESS_KEY = getLocalStorage(SECRET_KEY_NAME) || "";
  const SESSION_TOKEN = getLocalStorage(SESSION_TOKEN_NAME) || "";

  return new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
      sessionToken: SESSION_TOKEN,
    },
  });
};

export default generateS3Client;
