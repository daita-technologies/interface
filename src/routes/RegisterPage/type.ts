export interface UserInfoFormProps {
  autoComplete?: boolean;
  offFields?: {
    password: boolean;
    confirmPassword: boolean;
  };
  editMode?: boolean;
  userInfo?: any;
}

export interface CheckCaseTextProps {
  sx?: {
    [key: string]: any;
  };
  text: string;
  isPassed: boolean;
}
