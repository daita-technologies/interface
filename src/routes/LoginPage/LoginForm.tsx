import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  Container,
  TextField,
  Avatar,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  ThemeProvider,
} from "@mui/material";

import { useForm, SubmitHandler } from "react-hook-form";

import { RootState } from "reduxes";
import { lightTheme } from "styles/theme";

import Link from "components/common/Link";
import { ReCaptchaInput, MyButton } from "components";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginAction } from "reduxes/auth/actions";
import { RESET_LOGIN_ACCOUNT_NOT_VERIFY } from "reduxes/auth/constants";

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

  const { register, control, handleSubmit, getValues } =
    useForm<LoginFormFields>();
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
    history.push("/verify", { username: getValues("username") });
    dispatch({ type: RESET_LOGIN_ACCOUNT_NOT_VERIFY });
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
              label="Username"
              {...register("username", { required: true })}
              autoFocus={!location.state?.username}
              disabled={isLogging}
              defaultValue={location.state?.username || ""}
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

            <ReCaptchaInput control={control} register={register} />

            <Box mt={2}>
              <Link to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Box>

            <MyButton
              sx={{ mt: 3, mb: 2 }}
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              disabled={isLogging}
              isLoading={isLogging}
            >
              Log In
            </MyButton>
            {!isLoginAccountVerified && (
              <MyButton
                sx={{ mt: 3, mb: 2 }}
                fullWidth
                variant="contained"
                type="submit"
                color="warning"
                onClick={goToVerifyAccount}
              >
                Verify account now
              </MyButton>
            )}
            <Box textAlign="right" mt={3} mb={3}>
              <Link to={isLogging ? "#" : "/register"}>
                Don't have an account? Register
              </Link>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginForm;
