import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Box,
  Container,
  IconButton,
  Avatar,
  Typography,
  ThemeProvider,
} from "@mui/material";

import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { lightTheme } from "styles/theme";

import { RootState } from "reduxes";

import UserInfoForm from "./UserInfoForm";

const RegisterPage = function () {
  const history = useHistory();

  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );

  useEffect(() => {
    if (isLogged) {
      history.push("/");
    }
  });

  const onClickBack = () => {
    if (history.length <= 2) {
      history.push("/");
    } else {
      history.goBack();
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Container
        sx={{
          mt: 4,
          mb: 4,
          p: 4,
          backgroundColor: "common.white",
          color: "common.black",
          borderRadius: 1,
        }}
        maxWidth="xs"
      >
        <Helmet>
          <title>Sign Up to DAITA's Platform</title>
        </Helmet>
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
            >
              <VpnKeyOutlinedIcon />
            </Avatar>
            <Typography
              sx={{ mt: 1 }}
              align="center"
              component="h1"
              variant="h5"
            >
              ✍️ Sign Up
            </Typography>

            <Box sx={{ m: 3, py: 0, px: "14px" }}>
              <UserInfoForm />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
