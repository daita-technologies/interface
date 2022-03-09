import { Box, CircularProgress } from "@mui/material";
import {
  CREDENTIAL_TOKEN_EXPIRE_NAME,
  REFRESH_TOKEN_NAME,
  TEMP_LOCAL_USERNAME,
  TOKEN_EXPIRE_NAME,
} from "constants/defaultValues";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshTokenRequest } from "reduxes/auth/actions";
import { setIsCheckingApp } from "reduxes/general/action";
import { selectorIsCheckingApp } from "reduxes/general/selector";
import { getLocalStorage, getLocalToken } from "utils/general";
import { TokenCheckingProps } from "./type";

const CheckingApp = function ({ children }: TokenCheckingProps) {
  const freshTimeOutRef = useRef<any>();
  const dispatch = useDispatch();

  const isCheckingApp = useSelector(selectorIsCheckingApp);

  const handleRefreshToken = (isRefocus = false) => {
    const isLogged = !!getLocalToken();
    const tokenExpireIn = Number(getLocalStorage(TOKEN_EXPIRE_NAME) || "");
    const credentialTokenExpireIn = Number(
      getLocalStorage(CREDENTIAL_TOKEN_EXPIRE_NAME) || ""
    );
    const nowInMiliseconds = new Date().getTime();

    if (isLogged) {
      if (
        nowInMiliseconds >= tokenExpireIn ||
        nowInMiliseconds >= credentialTokenExpireIn
      ) {
        if (isRefocus) {
          dispatch(setIsCheckingApp({ isChecking: true }));
        }
        dispatch(
          refreshTokenRequest({
            username: getLocalStorage(TEMP_LOCAL_USERNAME) || "",
            refreshToken: getLocalStorage(REFRESH_TOKEN_NAME) || "",
          })
        );
      } else {
        dispatch(setIsCheckingApp({ isChecking: false }));

        const nearestExpireTime =
          tokenExpireIn < credentialTokenExpireIn
            ? tokenExpireIn
            : credentialTokenExpireIn;
        const refreshTokenAfter =
          nearestExpireTime - new Date().getTime() - 5 * 60 * 1000;

        if (freshTimeOutRef) {
          clearTimeout(freshTimeOutRef.current);
        }

        freshTimeOutRef.current = setTimeout(
          () => {
            dispatch(
              refreshTokenRequest({
                username: getLocalStorage(TEMP_LOCAL_USERNAME) || "",
                refreshToken: getLocalStorage(REFRESH_TOKEN_NAME) || "",
              })
            );
          },
          refreshTokenAfter > 0 ? refreshTokenAfter : 100
        );

        return () => {
          if (freshTimeOutRef) {
            clearTimeout(freshTimeOutRef.current);
          }
        };
      }
    } else {
      dispatch(setIsCheckingApp({ isChecking: false }));
    }
    return () => {};
  };

  const handleRefreshTokenWhenRefocus = () => handleRefreshToken(true);

  useEffect(() => {
    handleRefreshToken();

    window.addEventListener("focus", handleRefreshTokenWhenRefocus);

    return () => {
      window.removeEventListener("focus", handleRefreshTokenWhenRefocus);
    };
  }, []);

  if (isCheckingApp) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        minWidth="100vw"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default CheckingApp;
