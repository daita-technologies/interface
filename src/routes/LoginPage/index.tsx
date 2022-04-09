import { Container } from "@mui/material";
import {
  ACCESS_KEY_NAME,
  CREDENTIAL_TOKEN_EXPIRE_NAME,
  IDENTITY_ID_NAME,
  ID_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  SECRET_KEY_NAME,
  SESSION_TOKEN_NAME,
  TEMP_LOCAL_USERNAME,
  TOKEN_EXPIRE_NAME,
  TOKEN_NAME,
  USERNAME_NAME,
} from "constants/defaultValues";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { RootState } from "reduxes";
import { LOGIN } from "reduxes/auth/constants";
import { GENERATE_S3_CLIENT } from "reduxes/general/constants";
import { setListToken, setLocalStorage } from "utils/general";
import { TokenStorageTypes } from "utils/type";
import LoginForm from "./LoginForm";

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
    const accessKey = urlSearch.get(ACCESS_KEY_NAME);
    const credentialTokenExpiresIn = urlSearch.get(
      CREDENTIAL_TOKEN_EXPIRE_NAME
    );
    const idToken = urlSearch.get(ID_TOKEN_NAME);
    const identityId = urlSearch.get(IDENTITY_ID_NAME);
    const resfreshToken = urlSearch.get(REFRESH_TOKEN_NAME);
    const sessionKey = urlSearch.get(SESSION_TOKEN_NAME);
    const token = urlSearch.get(TOKEN_NAME);
    const tokenExpiresIn = urlSearch.get(TOKEN_EXPIRE_NAME);
    const secretKey = urlSearch.get(SECRET_KEY_NAME);
    const username = urlSearch.get(USERNAME_NAME);

    if (
      !accessKey ||
      !credentialTokenExpiresIn ||
      !idToken ||
      !identityId ||
      !resfreshToken ||
      !sessionKey ||
      !token ||
      !secretKey ||
      !tokenExpiresIn ||
      !username
    ) {
      return;
    }

    const tokenStorageTypes: TokenStorageTypes = {
      access_key: accessKey,
      credential_token_expires_in: +credentialTokenExpiresIn,
      id_token: idToken,
      identity_id: identityId,
      resfresh_token: resfreshToken,
      session_key: sessionKey,
      token,
      secret_key: secretKey,
      token_expires_in: Math.round(+tokenExpiresIn),
    };
    setListToken(tokenStorageTypes);
    setLocalStorage(TEMP_LOCAL_USERNAME, username);
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
