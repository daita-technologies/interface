import { ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  TextField,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ReCaptchaInput, MyButton, PageLoading } from "components";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useForm, SubmitHandler } from "react-hook-form";

import { UPDATE_USER_INFO } from "reduxes/auth/constants";
import { RootState } from "reduxes";
import { useRef, useState } from "react";
import moment from "moment";

import {
  EMAIL_REGEX,
  // PASSWORD_STRENGTH_REGEX,
  SYSTEM_DATE_FORMAT,
  SYSTEM_DATE_TIME_FORMAT,
} from "constants/defaultValues";

import { registerAction } from "reduxes/auth/actions";
import { CheckCaseTextProps, UserInfoFormProps } from "./type";

type RegisterFormFields = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  captcha: string;
};

const CheckCaseText = function ({ sx, text, isPassed }: CheckCaseTextProps) {
  return (
    <Box sx={sx} display="flex" alignItems="center">
      <CheckCircleIcon
        color={isPassed ? "success" : "disabled"}
        sx={{ mr: 1 }}
      />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
};

const eightChars = (value: string) => !!(value && value.length >= 8);
const lowerCase = (value: string) => /(?=.*[a-z])/.test(value);
const upperCase = (value: string) => /(?=.*[A-Z])/.test(value);
const oneDigit = (value: string) => /(?=.*\d)/.test(value);
const specialChar = (value: string) =>
  /(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])/.test(value);

const UserInfoForm = function ({
  autoComplete = false,
  offFields = {
    password: false,
    confirmPassword: false,
  },
  editMode = false,
  userInfo = null,
}: UserInfoFormProps) {
  const dispatch = useDispatch();

  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormFields>();

  const [isEightChars, setIsEightChars] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isOneDigit, setIsOneDigit] = useState(false);
  const [isSpecialChar, setIsSpecialChar] = useState(false);

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit: SubmitHandler<RegisterFormFields> = (data) => {
    const { username, email, password: passwordValue, captcha } = data;
    if (editMode) {
      dispatch({
        type: UPDATE_USER_INFO.REQUESTED,
        payload: {
          body: {
            ...data,
          },
        },
      });
    } else {
      dispatch(
        registerAction({ username, email, password: passwordValue, captcha })
      );
    }
  };

  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const isFormRequesting = useSelector(
    (state: RootState) => state.authReducer.isFormRequesting
  );

  const autoCompleteString = autoComplete ? "on" : "off";

  useEffect(() => {
    if (editMode && userInfo) {
      const dataNeedToSet = {
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
        sex: userInfo.sex,
        birthday: moment(userInfo.birthday, SYSTEM_DATE_TIME_FORMAT).format(
          SYSTEM_DATE_FORMAT
        ),
      };

      Object.keys(dataNeedToSet).forEach((key: string) => {
        // @ts-ignore
        setValue(key, dataNeedToSet[key]);
      });
    }
  }, [userInfo, editMode, setValue]);

  if (editMode && !userInfo) {
    return <PageLoading />;
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete={autoCompleteString}>
        <TextField
          variant="outlined"
          required
          fullWidth
          margin="normal"
          label="Username"
          {...register("username", { required: true })}
          autoFocus
          disabled={isFormRequesting || editMode}
          autoComplete={autoCompleteString}
          defaultValue={(userInfo && editMode && userInfo.username) || null}
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          margin="normal"
          label="Email"
          type="text"
          error={!!errors.email}
          helperText={(errors.email && errors.email.message) || ""}
          {...register("email", {
            required: true,
            pattern: {
              value: EMAIL_REGEX,
              message: "Email formatting is not correct.",
            },
          })}
          disabled={isFormRequesting || (editMode && userInfo.email)}
          autoComplete={autoCompleteString}
          defaultValue={(userInfo && editMode && userInfo.email) || null}
        />

        {/* TODO: password strength check */}
        {!offFields.password && (
          <FormControl
            fullWidth
            required
            margin="normal"
            variant="outlined"
            error={!!errors.password}
          >
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              {...register("password", {
                required: true,
                validate: {
                  eightChars,
                  lowerCase,
                  upperCase,
                  oneDigit,
                  specialChar,
                },
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  setValue("password", inputValue);
                  trigger("password");

                  setIsEightChars(eightChars(inputValue));
                  setIsLowerCase(lowerCase(inputValue));
                  setIsUpperCase(upperCase(inputValue));
                  setIsOneDigit(oneDigit(inputValue));
                  setIsSpecialChar(specialChar(inputValue));
                },
                // pattern: {
                //   value: PASSWORD_STRENGTH_REGEX,
                //   message: "Password did not conform with policy",
                // },
              })}
              type={isShowPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} tabIndex={-1}>
                    {isShowPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              disabled={isFormRequesting}
              autoComplete={!editMode ? "new-password" : autoCompleteString}
            />
            {errors.password?.message && (
              <FormHelperText error>{errors.password?.message}</FormHelperText>
            )}
            <Box mt={1}>
              <Typography sx={{ mb: 1 }} variant="body2" color="text.secondary">
                Your password must contain:
              </Typography>
              <Box ml={1}>
                <CheckCaseText
                  text="At least 8 characters"
                  isPassed={isEightChars}
                />
                {/* <CheckCaseText
                text="At least 3 of following:"
                isPassed={
                  isLowerCase && isUpperCase && isOneDigit && isSpecialChar
                }
              /> */}
                {/* <Box ml={3}> */}
                <CheckCaseText
                  text="Lower case letters (a-z)"
                  isPassed={isLowerCase}
                />
                <CheckCaseText
                  text="Upper case letters (A-Z)"
                  isPassed={isUpperCase}
                />
                <CheckCaseText text="Number (0-9)" isPassed={isOneDigit} />
                <CheckCaseText
                  text="Special characters (ex. !@#$%^&*)"
                  isPassed={isSpecialChar}
                />
              </Box>
              {/* </Box> */}
            </Box>
          </FormControl>
        )}

        {!offFields.confirmPassword && (
          <FormControl
            fullWidth
            required
            margin="normal"
            variant="outlined"
            error={!!errors.confirm_password}
          >
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              {...register("confirm_password", {
                required: true,
                validate: (confirmPassword) =>
                  confirmPassword === password.current ||
                  "Password do not match.",
              })}
              type={isShowPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} tabIndex={-1}>
                    {isShowPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
              disabled={isFormRequesting}
              autoComplete={autoCompleteString}
            />
            {errors.confirm_password && (
              <FormHelperText>{errors.confirm_password.message}</FormHelperText>
            )}
          </FormControl>
        )}

        <ReCaptchaInput control={control} register={register} />

        <Box
          sx={{
            margin: 1,
            position: "relative",
          }}
        >
          <MyButton
            sx={{
              mt: 3,
              mb: 2,
            }}
            fullWidth
            variant="contained"
            type="submit"
            color="primary"
            disabled={isFormRequesting}
            isLoading={isFormRequesting}
          >
            {editMode ? "SAVE" : "REGISTER"}
          </MyButton>
        </Box>
      </form>
    </Box>
  );
};

export default UserInfoForm;
