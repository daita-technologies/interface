import { Container } from "@mui/material";
import { PageLoading } from "components";
import {
  ACCESS_KEY_NAME,
  CREDENTIAL_TOKEN_EXPIRE_NAME,
  IDENTITY_ID_NAME,
  ID_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  SECRET_KEY_NAME,
  SESSION_TOKEN_NAME,
  TEMP_LOCAL_FULLNAME,
  TEMP_LOCAL_USERNAME,
  TOKEN_EXPIRE_NAME,
  TOKEN_NAME,
  USERNAME_NAME,
  USER_FULL_NAME_NAME,
} from "constants/defaultValues";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "reduxes";
import { LOGIN } from "reduxes/auth/constants";
import { setPageLoading } from "reduxes/general/action";
import { GENERATE_S3_CLIENT } from "reduxes/general/constants";
import { authApi } from "services";
import { setListToken, setLocalStorage } from "utils/general";
import { TokenStorageTypes } from "utils/type";
import LoginForm from "./LoginForm";

const LoginPage = function () {
  // TODO: user login account is not verify yet
  // support resend and navigate to verify screen
  // const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );
  const dispatch = useDispatch();

  const { search } = useLocation();
  useEffect(() => {
    const urlSearch = new URLSearchParams(search);
    const code = urlSearch.get("code");
    if (!code) {
      return;
    }
    dispatch(setPageLoading({ isShow: true, message: "Logging in..." }));
    authApi
      .loginSocial(code)
      .then((resp: any) => {
        if (resp.error === true) {
          dispatch(setPageLoading({ isShow: false }));
          toast.error(resp.message);
          return;
        }
        const { data } = resp;
        const accessKey = data[ACCESS_KEY_NAME];
        const credentialTokenExpiresIn = data[CREDENTIAL_TOKEN_EXPIRE_NAME];
        const idToken = data[ID_TOKEN_NAME];
        const identityId = data[IDENTITY_ID_NAME];
        const resfreshToken = data[REFRESH_TOKEN_NAME];
        const sessionKey = data[SESSION_TOKEN_NAME];
        const token = data[TOKEN_NAME];
        const tokenExpiresIn = data[TOKEN_EXPIRE_NAME];
        const secretKey = data[SECRET_KEY_NAME];
        const username = data[USERNAME_NAME];
        const name = data[USER_FULL_NAME_NAME];

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
          !username ||
          !name
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
        setLocalStorage(TEMP_LOCAL_FULLNAME, name || username);

        dispatch({ type: LOGIN.SUCCEEDED, payload: tokenStorageTypes });
        dispatch({ type: GENERATE_S3_CLIENT });
        dispatch(setPageLoading({ isShow: false }));
      })
      .catch(() => {
        dispatch(setPageLoading({ isShow: false }));
        toast.error("Login failed.");
      });
  }, []);
  useEffect(() => {
    if (isLogged) {
      history.push("/");
    }
  });

  return (
    <Container maxWidth="xs">
      <Helmet>
        <title>Log In to DAITA's Platform</title>
      </Helmet>
      <PageLoading />
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
