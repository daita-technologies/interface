import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Container,
  IconButton,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  TextField,
  ThemeProvider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { RootState } from "reduxes";

import { SubmitHandler, useForm } from "react-hook-form";
import { PASSWORD_STRENGTH_REGEX } from "constants/defaultValues";

import { ReCaptchaInput, MyButton } from "components";

import {
  forgotPasswordChange,
  forgotPasswordRequest,
  setIsForgotRequestStep,
} from "reduxes/auth/actions";
import {
  selectorIsForgotRequestStep,
  selectorIsFormRequesting,
} from "reduxes/auth/selector";
import { lightTheme } from "styles/theme";
import { ForgotPasswordRequestFields } from "./type";
import { selectorReloadRecaptchaTrigger } from "reduxes/general/selector";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordPage = function () {
  const history = useHistory();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgotPasswordRequestFields>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const isFormRequesting = useSelector(selectorIsFormRequesting);
  const isForgotRequestStep = useSelector(selectorIsForgotRequestStep);
  const reloadRecaptchaTrigger = useSelector(selectorReloadRecaptchaTrigger);

  useEffect(() => {
    recaptchaRef.current?.reset();
    setValue("captcha", "");
  }, [reloadRecaptchaTrigger]);

  const onSubmit: SubmitHandler<ForgotPasswordRequestFields> = (data) => {
    const { username, password: passwordValue, confirmCode, captcha } = data;
    if (isForgotRequestStep) {
      dispatch(forgotPasswordRequest({ username, captcha }));
    } else {
      dispatch(
        forgotPasswordChange({
          username,
          password: passwordValue,
          confirmCode,
        })
      );
    }
  };

  const password = useRef({});
  password.current = watch("password", "");

  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );

  useEffect(() => {
    if (isLogged) {
      history.push("/");
    }
  });

  const handleClickShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const onClickBack = () => {
    if (isForgotRequestStep) {
      if (history.length <= 2) {
        history.push("/");
      } else {
        history.goBack();
      }
    } else {
      dispatch(setIsForgotRequestStep({ isForgotRequestStep: true }));
    }
  };

  useEffect(
    () => () => {
      dispatch(setIsForgotRequestStep({ isForgotRequestStep: true }));
    },

    []
  );

  return (
    <ThemeProvider theme={lightTheme}>
      <Container
        sx={{
          mt: 4,
          backgroundColor: "common.white",
          color: "common.black",
          pt: 2,
          pb: 6,
          borderRadius: 1,
        }}
        maxWidth="xs"
      >
        <Box>
          <IconButton onClick={onClickBack}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Avatar
              sx={{
                my: 1,
                mb: 3,
                mx: "auto",
                width: 56,
                height: 56,
              }}
              src="/assets/images/logo.png"
              variant="square"
            />
            <Typography
              sx={{ mt: 1 }}
              align="center"
              component="h1"
              variant="h5"
            >
              Forgot Password
            </Typography>
            <Typography sx={{ mt: 1, px: 2 }} align="center" variant="body2">
              Enter your username to request a password change. Code will be
              sent to your email to verify.
            </Typography>
            <Box sx={{ mt: 3, py: 0, px: "14px" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  label="Username"
                  {...register("username", { required: true })}
                  autoFocus
                  disabled={isFormRequesting || !isForgotRequestStep}
                  // autoComplete={autoCompleteString}
                  // defaultValue={(userInfo && editMode && userInfo.username) || null}
                />

                {!isForgotRequestStep && (
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
                        pattern: {
                          value: PASSWORD_STRENGTH_REGEX,
                          message: "Password did not conform with policy",
                        },
                      })}
                      type={isShowPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            tabIndex={-1}
                          >
                            {isShowPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      disabled={isFormRequesting}
                      autoComplete="new-password"
                      autoFocus
                    />
                    <FormHelperText>
                      Should have 1 lowercase letter, 1 uppercase letter, 1
                      number, 1 special character and be at least 8 characters
                      long
                    </FormHelperText>
                  </FormControl>
                )}

                {!isForgotRequestStep && (
                  <FormControl
                    fullWidth
                    required
                    margin="normal"
                    variant="outlined"
                    error={!!errors.confirmPassword}
                  >
                    <InputLabel>Confirm Password</InputLabel>
                    <OutlinedInput
                      {...register("confirmPassword", {
                        required: true,
                        validate: (confirmPassword) =>
                          confirmPassword === password.current ||
                          "Password do not match.",
                      })}
                      type={isShowPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            tabIndex={-1}
                          >
                            {isShowPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                      disabled={isFormRequesting}
                      // autoComplete={autoCompleteString}
                    />
                    {errors.confirmPassword && (
                      <FormHelperText>
                        {errors.confirmPassword.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
                {!isForgotRequestStep && (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    margin="normal"
                    label="Verify code"
                    {...register("confirmCode", {
                      required: true,
                      pattern: {
                        value: /^\d{1,6}/,
                        message: "Please input number only",
                      },
                      maxLength: 6,
                    })}
                    error={!!errors.confirmCode}
                    helperText={errors.confirmCode?.message}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    inputProps={{ maxLength: 6 }}
                    disabled={isFormRequesting}
                  />
                )}
                {isForgotRequestStep && (
                  <ReCaptchaInput
                    recaptchaRef={recaptchaRef}
                    control={control}
                    register={register}
                  />
                )}
                <Box textAlign="center" mt={2}>
                  <MyButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                    isLoading={isFormRequesting}
                  >
                    {isForgotRequestStep
                      ? "Forgot Password"
                      : "Change Password"}
                  </MyButton>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPasswordPage;
