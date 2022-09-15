import { encode } from "js-base64";
import { getLocalToken } from "utils/general";

import { TaskProcessType, TaskStatusMergedType } from "./taskType";
import { CreateProjectDatasetTypeControlType } from "./type";

export const authApiURL = process.env.REACT_APP_AUTH_API_URL;
export const projectApiUrl = process.env.REACT_APP_PROJECT_API_URL;
export const createProjectSampleApiUrl =
  process.env.REACT_APP_CREATE_PROJECT_SAMPLE;
export const generateApiUrl = process.env.REACT_APP_GENERATE_API_URL;
export const downloadZipApiUrl = process.env.REACT_APP_DOWNLOAD_ZIP_API;
export const uploadZipApiUrl = process.env.REACT_APP_UPLOAD_ZIP_API;
export const inviteApiURL = process.env.REACT_APP_INVITE_API_URL;
export const healthCheckApiURL = process.env.REACT_APP_HEALTH_CHECK_API_URL;
export const taskApiURL = process.env.REACT_APP_TASK_API_URL;
export const customMethodUrl = process.env.REACT_APP_GENERATE_API_URL;
export const stopApiURL = process.env.REACT_APP_TASK_API_URL;
export const feedbackSlackApiURL = process.env.REACT_APP_FEEDBACK_SLACK;
export const presignURLUploadFeedbackImageSlackApiURL =
  process.env.REACT_APP_PRESIGN_URL_UPLOAD_FEEDBACK_IMAGE;
export const reactAppDevEnv = "development";
export const reactAppProdEnv = "production";
export const reactAppEnv = process.env.REACT_APP_ENV;

export const RECAPTCHA_SITE_KEY =
  process.env.REACT_APP_RECAPTCHA_SITE_KEY || "";

export const ROOT_URL = `${window.location.protocol}//${window.location.host}`;
export const LOGIN_URL = `${ROOT_URL}/login`;
export const LOGIN_SOCIAL_CALLBACK_URL = encode(LOGIN_URL);
export const LOGOUT_SOCIAL_API = `${process.env.REACT_APP_API_LOGOUT_SOCIAL}&logout_uri=${ROOT_URL}`;

export const API_AMAZON_COGNITO = process.env.REACT_APP_API_AMAZON_COGNITO;
export const COGNITO_REDIRECT_URI = process.env.REACT_APP_COGNITO_REDIRECT_URI;
export const COGNITO_CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENTID;
export const GITHUB_IDENTITY_PROVIDER =
  process.env.REACT_APP_GITHUB_IDENTITY_PROVIDER;

export const LOGIN_SOCIAL_CODE_NAME = "code";

export const TOKEN_NAME = "token";
export const TOKEN_EXPIRE_NAME = "token_expires_in";
export const REFRESH_TOKEN_NAME = "resfresh_token";
export const ID_TOKEN_NAME = "id_token";
export const CREDENTIAL_TOKEN_EXPIRE_NAME = "credential_token_expires_in";
export const ACCESS_KEY_NAME = "access_key";
export const SECRET_KEY_NAME = "secret_key";
export const SESSION_TOKEN_NAME = "session_key";
export const USERNAME_NAME = "username";
export const USER_FULL_NAME_NAME = "name";
export const IDENTITY_ID_NAME = "identity_id";

export const TOKEN_LIST = [
  TOKEN_NAME,
  TOKEN_EXPIRE_NAME,
  REFRESH_TOKEN_NAME,
  ID_TOKEN_NAME,
  CREDENTIAL_TOKEN_EXPIRE_NAME,
  ACCESS_KEY_NAME,
  SECRET_KEY_NAME,
  SESSION_TOKEN_NAME,
  IDENTITY_ID_NAME,
] as const;

export const getAuthHeader = () => ({
  Authorization: `Bearer ${getLocalToken()}`,
});

export const EMAIL_REGEX = /^([a-z0-9_.+-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
export const EMAIL_OR_USERNAME_REGEX =
  /^([a-z0-9_.+-]+)@([\da-z.-]+)\.([a-z.]{2,6})|^([a-z0-9_.+-]+)$/;
export const PHONE_VI_REGEX =
  /(^((0[3|5|7|8|9])+([0-9]{8})\b)\/?$)|(^(((\+)?84)+([0-9]{9})\b)\/?$)/;
export const USERNAME_REGEX = /^([a-z0-9@^$.!`\-#+'~_]+)$/;
export const PASSWORD_STRENGTH_REGEX =
  /(?=(.*[0-9]))(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

export const SYSTEM_DATE_TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
export const SYSTEM_DATE_FORMAT = "YYYY/MM/DD";
export const SYSTEM_TIME_FORMAT = "HH:mm:ss";

export const VIEW_ALBUM_PAGE_SIZE = 10;
export const MAXIMUM_FETCH_IMAGES_AMOUNT = 1000;

export const ORIGINAL_IMAGES_TAB = 0;
export const PREPROCESS_IMAGES_TAB = 1;
export const AUGMENT_IMAGES_TAB = 2;

export const PREPROCESS_GENERATE_TAB = 0;
export const AUGMENTATION_GENERATE_TAB = 1;

export const ORIGINAL_SOURCE = "ORIGINAL";
export const PREPROCESS_SOURCE = "PREPROCESS";
export const AUGMENT_SOURCE = "AUGMENT";

export const PREPROCESS_TASK_PROCESS_TYPE = "PREPROCESS";
export const AUGMENT_TASK_PROCESS_TYPE = "AUGMENT";
export const UPLOAD_TASK_PROCESS_TYPE = "UPLOAD";
export const DOWNLOAD_TASK_PROCESS_TYPE = "DOWNLOAD";
export const HEALTHCHECK_TASK_PROCESS_TYPE = "HEALTHCHECK";
export const GENERATE_REFERENCE_IMAGE_TYPE = "REFERENCE_IMAGE";
export const FILTER_ALL_TASK_PROCESS_TYPE = "";

export const ALL_TASK_TYPE_ARRAY: TaskProcessType[] = [
  HEALTHCHECK_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  AUGMENT_TASK_PROCESS_TYPE,
  UPLOAD_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  GENERATE_REFERENCE_IMAGE_TYPE,
];

export const MAX_AUGMENT_FREE_PLAN = 5;

export const TRAINING_DATA_NUMBER_INDEX = 0;
export const VALIDATION_DATA_NUMBER_INDEX = 1;
export const TEST_DATA_NUMBER_INDEX = 2;

export const PENDING_TASK_STATUS = "PENDING";
export const PREPARING_HARDWARE_TASK_STATUS = "PREPARING_HARDWARE";
export const PREPARING_DATA_TASK_STATUS = "PREPARING_DATA";
export const RUNNING_TASK_STATUS = "RUNNING";
export const UPLOADING_TASK_STATUS = "UPLOADING";
export const FINISH_TASK_STATUS = "FINISH";
export const ERROR_TASK_STATUS = "ERROR";
export const FINISH_ERROR_TASK_STATUS = "FINISH_ERROR";
export const CANCEL_TASK_STATUS = "CANCEL";
export const FILTER_ALL_TASK_STATUS = "";

export const TASK_STATUS_MERGED_ARRAY: TaskStatusMergedType[] = [
  RUNNING_TASK_STATUS,
  ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  CANCEL_TASK_STATUS,
];

export const EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE = "empty";
export const EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_LABEL = "Empty";
export const EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_DESCRIPTION =
  "Create project with empty dataset";
export const EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE =
  "existing_dataset";
export const EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_LABEL =
  "Existing dataset";
export const EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_DESCRIPTION =
  "Create project with existing dataset";

export const CREATE_PROJECT_DATASET_TYPE_LIST: CreateProjectDatasetTypeControlType[] =
  [
    {
      value: EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
      label: EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_LABEL,
      description: EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_DESCRIPTION,
    },
    {
      value: EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
      label: EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_LABEL,
      description: EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_DESCRIPTION,
    },
  ];

export const MIN_DATASET_IMAGES_CREATE_PROJECT = 1;
export const MAX_DATASET_IMAGES_CREATE_PROJECT = 1000;

export const TEMP_LOCAL_USERNAME = "temp_username_key";
export const TEMP_LOCAL_FULLNAME = "temp_fullname_key";

export const PREPROCESSING_GENERATE_IMAGES_TYPE =
  "PREPROCESSING_GENERATE_IMAGES_TYPE";
export const AUGMENT_GENERATE_IMAGES_TYPE = "AUGMENT_GENERATE_IMAGES_TYPE";
export const PREPROCESSING_GENERATE_IMAGES_TYPE_LABEL = "preprocessing";
export const AUGMENT_GENERATE_IMAGES_TYPE_LABEL = "augmentation";

export const GENERATING_SAMPLE_PROJECT_STATUS = "GENERATING";
export const FINISH_SAMPLE_PROJECT_STATUS = "FINISH";

export const LATEST_SELECTED_DATA_SOURCE_KEY_NAME =
  "latest_selected_data_source_key_name";

export const MAX_ALLOW_UPLOAD_IMAGES = 1000;
export const LIMIT_UPLOAD_IMAGE_SIZE = 5000000;
export const MAX_ALLOW_UPLOAD_IMAGES_AT_THE_SAME_TIME = 1000;

export const ALL_DOWNLOAD_TYPE = "ALL";
export const PREPROCESS_DOWNLOAD_TYPE = "PREPROCESS";
export const ORIGINAL_DOWNLOAD_TYPE = "ORIGINAL";
export const AUGMENT_DOWNLOAD_TYPE = "AUGMENT";

export const RUNNING_DOWNLOAD_EC2_ZIP_PROGRESS_TYPE = "RUNNING";
export const FINISH_DOWRUNNING_DOWNLOAD_EC2_ZIP_PROGRESS_TYPENLOAD_TYPE =
  "FINISH";

export const ERROR_MESSAGE_ACCOUNT_NOT_VERIFY =
  "User need to verify confirmation code";

export const DEFAULT_SPLIT_DATASET_PERCENT_RATE = [70, 20, 10];

export const COMPRESS_FILE_EXTENSIONS = [".tar", ".gz", ".bz2", ".zip"];

export const TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE = "custom_method_expert_mode";

export const IMAGE_EXTENSIONS = [".jpeg", ".png", ".jpg"];
export const MAXIMUM_ZIP_FILE_SIZE = 2000000000;

export const VISIBLE_TOAST_MESSAGE_SECOND_TIME = 4000;

export const RESOLUTION_METHOD_ID = "PRE-009";
export const GRAYSCALE_METHOD_ID = "PRE-001";
export const GRASCALE_PREPROCESS_METHOD_ALLOW_LIST = [
  GRAYSCALE_METHOD_ID,
  "PRE-009",
  "PRE-002",
  "PRE-000",
];

export const LIMIT_IMAGE_WIDTH = 4000;
export const LIMIT_IMAGE_HEIGHT = 4000;

export const AUGMENT_OPTION_TOOLTIP =
  "Data source: Augmentation is only applied to the training dataset based on the data source you previously selected. For each augmentation run, you can define a new data source and a training/validation/test split.";

export const PROGRESS_POOLING_INTERVAL = 15000;
export const UPLOAD_PRESIGN_URL_SUCCESS_CODE = 204;
export const MAX_FEEDBACK_MESSAGE_LENGTH = 750;
export const MAX_NUM_FEEDBACK_ATTACHED_FILE = 3;
export const MAX_SIZE_FEEDBACK_ATTACHED_FILE = 2000000;

export const QUIT_FEEDBACK_ALERT_MESSAGE =
  "Your feedback content will be lost. Are you sure you want to quit?";
