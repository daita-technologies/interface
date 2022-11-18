import { Box, CircularProgress, Typography } from "@mui/material";
import {
  CREDENTIAL_TOKEN_EXPIRE_NAME,
  LAST_USED_SYSTEM_STORAGE_KEY_NAME,
  REFRESH_TOKEN_NAME,
  TEMP_LOCAL_USERNAME,
  TOKEN_EXPIRE_NAME,
  TWENTY_FOUR_HOURS_AS_MILISECONDS,
} from "constants/defaultValues";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { refreshTokenRequest } from "reduxes/auth/actions";
import { LOG_OUT } from "reduxes/auth/constants";
import { setIsCheckingApp } from "reduxes/general/action";
import { selectorIsCheckingApp } from "reduxes/general/selector";
import { getLocalStorage, getLocalToken, setLocalStorage } from "utils/general";
import { TokenCheckingProps } from "./type";

const CheckingApp = function ({ children }: TokenCheckingProps) {
  const freshTimeOutRef = useRef<any>();
  const inactiveTimerRef = useRef<any>(null);
  const dispatch = useDispatch();

  const isCheckingApp = useSelector(selectorIsCheckingApp);

  const handleInactiveTimer = () => {
    const isLogged = !!getLocalToken();
    if (isLogged) {
      clearTimeout(inactiveTimerRef.current);
      inactiveTimerRef.current = setTimeout(() => {
        toast.info("You have been logged out due to 24 hours of inactivity.");
        dispatch({ type: LOG_OUT.REQUESTED });
      }, TWENTY_FOUR_HOURS_AS_MILISECONDS);
    }
  };

  const handleLastUsedSystem = () => {
    const isLogged = !!getLocalToken();
    if (isLogged) {
      const lastUsedSystemDateTimeString =
        getLocalStorage(LAST_USED_SYSTEM_STORAGE_KEY_NAME) || "";

      if (
        new Date().getTime() -
          Number(lastUsedSystemDateTimeString || new Date().getTime()) >=
        TWENTY_FOUR_HOURS_AS_MILISECONDS
      ) {
        toast.info("You have been logged out due to 24 hours of inactivity.");
        dispatch({ type: LOG_OUT.REQUESTED });
      }
    }
  };

  const setLastUsedSystemTime = () => {
    const isLogged = !!getLocalToken();
    if (isLogged) {
      setLocalStorage(LAST_USED_SYSTEM_STORAGE_KEY_NAME, new Date().getTime());
    }
  };

  const triggerIntervalLastUsedSystemTime = () => {
    setInterval(() => {
      setLastUsedSystemTime();
    }, 60 * 1000);
  };

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

    triggerIntervalLastUsedSystemTime();
    handleLastUsedSystem();

    window.addEventListener("onload", handleInactiveTimer);
    window.addEventListener("focus", handleInactiveTimer);
    document.addEventListener("mousemove", handleInactiveTimer);
    document.addEventListener("keypress", handleInactiveTimer);

    window.addEventListener("focus", handleRefreshTokenWhenRefocus);

    return () => {
      window.removeEventListener("onload", handleInactiveTimer);
      window.removeEventListener("focus", handleInactiveTimer);
      document.removeEventListener("mousemove", handleInactiveTimer);
      document.removeEventListener("keypress", handleInactiveTimer);

      window.removeEventListener("focus", handleRefreshTokenWhenRefocus);
    };
  }, []);

  if (isCheckingApp) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        minWidth="100vw"
      >
        <CircularProgress size={40} />
        <Typography mt={1}>Checking application status...</Typography>
      </Box>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default CheckingApp;
