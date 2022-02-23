import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container } from "@mui/material";
import { RootState } from "reduxes";

import LoginForm from "./LoginForm";

const LoginPage = function () {
  // TODO: user login account is not verify yet
  // support resend and navigate to verify screen
  const history = useHistory();
  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );

  useEffect(() => {
    if (isLogged) {
      history.push("/");
    }
  });

  return (
    <Container maxWidth="xs">
      <Helmet>
        <title>Log in to DAITA's Platform</title>
      </Helmet>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
