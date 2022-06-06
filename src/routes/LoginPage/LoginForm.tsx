import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { MyButton, ReCaptchaInput } from "components";
import Link from "components/common/Link";
import {
  API_AMAZON_COGNITO,
  COGNITO_CLIENT_ID,
  COGNITO_REDIRECT_URI,
  EMAIL_OR_USERNAME_REGEX,
  LOGIN_SOCIAL_CALLBACK_URL,
} from "constants/defaultValues";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { RootState } from "reduxes";
import { loginAction } from "reduxes/auth/actions";
import { RESET_LOGIN_ACCOUNT_NOT_VERIFY } from "reduxes/auth/constants";
import { selectorReloadRecaptchaTrigger } from "reduxes/general/selector";
import { lightTheme } from "styles/theme";
import { setPageLoading } from "reduxes/general/action";

type LoginFormFields = {
  username: string;
  password: string;
  captcha: string;
};

const LoginForm = function () {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const history = useHistory();
  const [isShowPassword, setIsShowPassword] = useState(false);
  // const [refreshIndex, setRefreshIndex] = useState(1);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginFormFields>({ mode: "onChange" });

  const reloadRecaptchaTrigger = useSelector(selectorReloadRecaptchaTrigger);

  useEffect(() => {
    recaptchaRef.current?.reset();
    setValue("captcha", "");
  }, [reloadRecaptchaTrigger]);

  const isLoginAccountVerified = useSelector(
    (state: RootState) => state.authReducer.isLoginAccountVerified
  );
  const onSubmit: SubmitHandler<LoginFormFields> = (data) => {
    dispatch(loginAction(data));
  };

  const handleClickShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const isLogging = useSelector(
    (state: RootState) => state.authReducer.isLogging
  );

  const goToVerifyAccount = () => {
    history.push("/verify", { username: getValues("username"), retry: true });
    dispatch({ type: RESET_LOGIN_ACCOUNT_NOT_VERIFY });
  };

  useEffect(() => {
    if (!isLoginAccountVerified) {
      goToVerifyAccount();
    }
  }, [isLoginAccountVerified]);

  const renderSocialLoginButton = (label: string, icon: React.ReactNode) => (
    <Button
      sx={{
        textTransform: "none",
        color: "text.secondary",
        justifyContent: "flex-start",
        fontWeight: 400,
      }}
      variant="outlined"
      fullWidth
      startIcon={icon}
    >
      {label}
    </Button>
  );
  const renderGoogleLogin = renderSocialLoginButton(
    "Continue with Google",

    <Avatar
      sx={{ width: 35, height: 35 }}
      src="/assets/images/google-icon.svg"
    />
  );
  const renderGitHubLogin = renderSocialLoginButton(
    "Continue with GitHub",
    <Avatar
      sx={{ width: 35, height: 35 }}
      src="/assets/images/github-icon.svg"
    />
  );
  const onClickLoginSocial = () => {
    dispatch(setPageLoading({ isShow: true }));
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <Container
        sx={{
          mt: 7,
          mb: 4,
          backgroundColor: "common.white",
          color: "common.black",
          p: 4,
          borderRadius: 1,
        }}
        maxWidth="xs"
      >
        <Avatar
          sx={{
            my: 1,
            mb: 3,
            mx: "auto",
            width: 56,
            height: 56,
          }}
          variant="square"
          src="/assets/images/logo.png"
        />

        <Typography sx={{ mt: 1 }} align="center" component="h1" variant="h5">
          Welcome
        </Typography>
        <Typography sx={{ mt: 1, px: 2 }} align="center" variant="body2">
          Log in to DAITA Technologies to continue to DAITA's platform.
        </Typography>
        <Box mt={3}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              required
              fullWidth
              margin="normal"
              label="Username or email address"
              {...register("username", {
                required: true,
                pattern: {
                  value: EMAIL_OR_USERNAME_REGEX,
                  message: "Please enter a valid username or email address.",
                },
              })}
              autoFocus={!location.state?.username}
              disabled={isLogging}
              defaultValue={location.state?.username || ""}
              error={!!errors.username}
              helperText={(errors.username && errors.username.message) || ""}
            />
            {/* {errors.username && <span>This field is required</span>} */}
            <TextField
              type={isShowPassword ? "text" : "password"}
              variant="outlined"
              required
              label="Password"
              fullWidth
              margin="normal"
              {...register("password", { required: true })}
              disabled={isLogging}
              autoFocus={!!location.state?.username}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} tabIndex={-1}>
                      {isShowPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <ReCaptchaInput
              recaptchaRef={recaptchaRef}
              control={control}
              register={register}
            />

            <Box mt={2}>
              <Link
                to="/forgot-password"
                variant="body2"
                sx={{ fontWeight: "bold", textDecoration: "none", fontSize: 14 }}
              >
                Forgot password?
              </Link>
            </Box>
            <MyButton
              sx={{ mt: 3 }}
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              disabled={isLogging}
              isLoading={isLogging}
            >
              CONTINUE
            </MyButton>
            <Box mt={3} mb={3}>
              <Typography component="span" variant="body2">
                Don't have an account?{" "}
              </Typography>
              <Link
                to={isLogging ? "/" : "/register"}
                sx={{ fontWeight: "bold", textDecoration: "none", fontSize: 14 }}
                variant="body2"
              >
                Sign up
              </Link>
            </Box>
            <Divider
              sx={{
                mt: 1,
                mb: 3,
                borderWidth: 3,
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              OR
            </Divider>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <a
                className="login-link"
                style={{ width: "100%" }}
                href={`${API_AMAZON_COGNITO}?identity_provider=Google&redirect_uri=${COGNITO_REDIRECT_URI}&response_type=CODE&client_id=${COGNITO_CLIENT_ID}&scope=email openid phone profile&state=${LOGIN_SOCIAL_CALLBACK_URL}`}
                onClick={onClickLoginSocial}
              >
                {renderGoogleLogin}
              </a>

              <a
                className="login-link"
                style={{ width: "100%" }}
                href={`${API_AMAZON_COGNITO}?identity_provider=Github&redirect_uri=${COGNITO_REDIRECT_URI}&response_type=CODE&client_id=${COGNITO_CLIENT_ID}&scope=email openid phone profile&state=${LOGIN_SOCIAL_CALLBACK_URL}`}
                onClick={onClickLoginSocial}
              >
                {renderGitHubLogin}
              </a>
            </Stack>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginForm;
