import { CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "reduxes";

function PageLoading({ size = 50 }: { size?: number }) {
  const isShow = useSelector((state: RootState) => state.generalReducer.isShow);
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
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 9999,
          }}
          size={size}
        />
      </Box>
    );
  }
  return null;
}

export default PageLoading;
