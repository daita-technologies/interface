import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  Box,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { MyButton, ReCaptchaInput } from "components";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "reduxes";
import {
  forgotPasswordChange,
  forgotPasswordRequest,
  setIsForgotRequestStep,
} from "reduxes/auth/actions";
import {
  selectorIsForgotRequestStep,
  selectorIsFormRequesting,
} from "reduxes/auth/selector";
import { selectorReloadRecaptchaTrigger } from "reduxes/general/selector";
import {
  CheckCaseText,
  eightChars,
  lowerCase,
  oneDigit,
  specialChar,
  upperCase,
} from "routes/RegisterPage/UserInfoForm";
import { lightTheme } from "styles/theme";
import { ForgotPasswordRequestFields } from "./type";

const ForgotPasswordPage = function () {
  const history = useHistory();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isEightChars, setIsEightChars] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isOneDigit, setIsOneDigit] = useState(false);
  const [isSpecialChar, setIsSpecialChar] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<ForgotPasswordRequestFields>({ mode: "onChange" });
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

  const generateReCatpchaToken = async () => {
    if (recaptchaRef && recaptchaRef.current) {
      const token = await recaptchaRef.current.executeAsync();
      setValue("captcha", token || "");
      onSubmit(getValues());
    }
  };

  const onInvalidSubmit: SubmitErrorHandler<ForgotPasswordRequestFields> = (
    error
  ) => {
    if (error.captcha && error.captcha.type === "required") {
      generateReCatpchaToken();
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
      <Helmet>
        <title>Forgot Password to DAITA's Platform</title>
      </Helmet>
      <Container
        sx={{
          my: 4,
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
              <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}>
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
                    />
                    {errors.password?.message && (
                      <FormHelperText error>
                        {errors.password?.message}
                      </FormHelperText>
                    )}
                    <Box mt={1}>
                      <Typography
                        sx={{ mb: 1 }}
                        variant="body2"
                        color="text.secondary"
                      >
                        Your password must contain:
                      </Typography>
                      <Box ml={1}>
                        <CheckCaseText
                          text="At least 8 characters"
                          isPassed={isEightChars}
                        />
                        <CheckCaseText
                          text="Lower case letters (a-z)"
                          isPassed={isLowerCase}
                        />
                        <CheckCaseText
                          text="Upper case letters (A-Z)"
                          isPassed={isUpperCase}
                        />
                        <CheckCaseText
                          text="Number (0-9)"
                          isPassed={isOneDigit}
                        />
                        <CheckCaseText
                          text="Special characters (ex. !@#$%^&*)"
                          isPassed={isSpecialChar}
                        />
                      </Box>
                    </Box>
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
                    label="Your Verification Code"
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
                <Box textAlign="center" mt={3}>
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
