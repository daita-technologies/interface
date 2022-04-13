import { CircularProgress, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectorIsShow, selectorMessage } from "reduxes/general/selector";

function PageLoading({ size = 50 }: { size?: number }) {
  const isShow = useSelector(selectorIsShow);
  const message = useSelector(selectorMessage);

  if (isShow) {
    return (
      <Box
        sx={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          position: "fixed",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 9998,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 9999,
            textAlign: "center",
          }}
        >
          <CircularProgress size={size} />
          {message && (
            <Typography variant="body1" component="h1" color="white">
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
  return null;
}

export default PageLoading;
