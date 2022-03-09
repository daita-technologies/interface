import { useLocation, Redirect } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  CardMedia,
  Container,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { RootState } from "reduxes";
import { VERIFY_ACCOUNT } from "reduxes/auth/constants";
import { useState } from "react";
import useInterval from "hooks/useInterval";
import { authApi } from "services";
import { toast } from "react-toastify";
import { VerifyFormInputs } from "./type";

const TIMEOUT_TO_CALL_RESEND = 30;

const VerifyAccountPage = function () {
  const location = useLocation<any>();
  const dispatch = useDispatch();
  const [resendTime, setResendTime] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormInputs>();

  const isVerifying = useSelector(
    (state: RootState) => state.authReducer.isVerifying
  );

  const onSubmit: SubmitHandler<VerifyFormInputs> = (data) => {
    dispatch({
      type: VERIFY_ACCOUNT.REQUESTED,
      payload: {
        body: data,
      },
    });
  };

  const onIntervalResendTime = () => {
    setResendTime((prevTime) => prevTime - 1);
  };

  useInterval(onIntervalResendTime, resendTime > 0 ? 1000 : null);

  if (location.state) {
    const { username, email, retry } = location.state;
    const sendCode = () => {
      authApi
        .resendRegisterCode({ username })
        .then((resendRes) => {
          if (resendRes) {
            if (!resendRes.data.error) {
              toast.success("Code has been resent.");
            } else {
              toast.error(resendRes.data.message);
            }
          }
        })
        .catch(() => {
          toast.error(`Can not send request.`);
        });
    };
    if (retry == true) {
      sendCode();
      location.state = { ...location.state, retry: false };
    }
    const onClickResend = () => {
      setResendTime(TIMEOUT_TO_CALL_RESEND);
      sendCode();
    };

    return (
      <Container sx={{ mt: 4 }} maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mt: 6,
          }}
        >
          <Typography variant="h4">Verify your email</Typography>
          <Typography>
            You will need to verify your email to complete the registration
          </Typography>
          <CardMedia
            sx={{ padding: 6, maxWidth: 600 }}
            component="img"
            src="/assets/images/mailbox.png"
          />
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <TextField
              variant="outlined"
              required
              fullWidth
              margin="normal"
              label="Verify code"
              {...register("confirm_code", {
                required: true,
                pattern: {
                  value: /^\d{1,6}/,
                  message: "Please input number only",
                },
                maxLength: 6,
              })}
              autoFocus
              error={!!errors.confirm_code}
              helperText={errors.confirm_code?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={onClickResend} disabled={resendTime > 0}>
                      {resendTime || "Resend"}
                    </Button>
                  </InputAdornment>
                ),
              }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              inputProps={{ maxLength: 6 }}
            />
            <Input
              sx={{ display: "none" }}
              {...register("username", { required: true })}
              defaultValue={username}
            />
            <Button
              type="submit"
              sx={{ mt: 2, mb: 4 }}
              variant="contained"
              disabled={isVerifying}
            >
              Confirm
            </Button>
          </form>
          <Typography>
            An email has been sent to {email ? `"${email}"` : "your email"} with
            a link to verify your account. <br /> If you have not received the
            email after a few minutes, please check your spam folder. <br />{" "}
            Please note that your code will expire after 1 hour.
          </Typography>
        </Box>
      </Container>
    );
  }

  return <Redirect to="/" />;
};

export default VerifyAccountPage;
