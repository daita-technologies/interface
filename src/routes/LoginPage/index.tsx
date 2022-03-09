import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Container } from "@mui/material";
import { RootState } from "reduxes";

import LoginForm from "./LoginForm";
import { TokenStorageTypes } from "utils/type";
import { setListToken, setLocalStorage } from "utils/general";
import { TEMP_LOCAL_USERNAME } from "constants/defaultValues";
import { LOGIN } from "reduxes/auth/constants";
import { GENERATE_S3_CLIENT } from "reduxes/general/constants";

const LoginPage = function () {
  // TODO: user login account is not verify yet
  // support resend and navigate to verify screen
  const history = useHistory();
  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );
  const dispatch = useDispatch();

  const search = useLocation().search;
  useEffect(() => {
    const urlSearch = new URLSearchParams(search);
    const access_key = urlSearch.get("access_key");
    const credential_token_expires_in = urlSearch.get(
      "credential_token_expires_in"
    );
    const id_token = urlSearch.get("id_token");
    const identity_id = urlSearch.get("identity_id");
    const resfresh_token = urlSearch.get("resfresh_token");
    const session_key = urlSearch.get("session_key");
    const token = urlSearch.get("token");
    const token_expires_in = urlSearch.get("token_expires_in");
    const secret_key = urlSearch.get("secret_key");

    if (
      !access_key ||
      !credential_token_expires_in ||
      !id_token ||
      !identity_id ||
      !resfresh_token ||
      !session_key ||
      !token ||
      !secret_key ||
      !token_expires_in
    ) {
      return;
    }

    const tokenStorageTypes: TokenStorageTypes = {
      access_key,
      credential_token_expires_in: +credential_token_expires_in,
      id_token,
      identity_id,
      resfresh_token,
      session_key,
      token,
      secret_key,
      token_expires_in: +token_expires_in,
    };
    setListToken(tokenStorageTypes);
    setLocalStorage(TEMP_LOCAL_USERNAME, "email");
    dispatch({ type: LOGIN.SUCCEEDED, payload: tokenStorageTypes });
    dispatch({ type: GENERATE_S3_CLIENT });
  }, []);
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
