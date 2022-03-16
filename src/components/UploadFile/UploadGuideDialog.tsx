import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectorUserInfo } from "reduxes/auth/selector";

const UploadGuideDialog = function ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const userInfo = useSelector(selectorUserInfo);
  const generalStyle = { margin: 0 };
  const commentStyle = { ...generalStyle, color: "#858e93" };
  const colorStringStyle = { color: "#98cae8" };
  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ p: 4 }}>
        Upload your dataset programmatically
      </DialogTitle>
      <DialogContent sx={{ px: 4 }}>
        <DialogContentText pb={2} color="text.primary">
          <Typography variant="body2">
            Hi {userInfo ? userInfo.username : ""} 👋!
            <Typography mt={2} variant="body2">
              Congratulations on using our easy-to-use image upload tool via
              API. Simply use the following command to upload images to your
              project:
              <Box
                mt={2}
                p={2}
                sx={{
                  border: "1px solid",
                  borderColor: "text.secondary",
                }}
                fontFamily={"Consolas,monaco,monospace"}
                fontSize={14}
              >
                <p style={commentStyle}>
                  # ensure that you have installed our pip package in your
                  Python environment
                </p>
                <p style={generalStyle}>pip install daita </p>
                <br></br>
                <p style={commentStyle}>
                  # upload your dataset using the following command
                </p>
                <p style={commentStyle}>
                  # (don't forget to set `path_to_your_dataset`)
                </p>
                <p style={{ ...generalStyle, whiteSpace: "nowrap" }}>
                  daita api-token=
                  <span style={colorStringStyle}>'d478a...'</span>
                  dataset_id=
                  <span style={colorStringStyle}>'6225d1...'</span>
                  input_dir='path_to_your_dataset'
                </p>
              </Box>
            </Typography>
          </Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
export default UploadGuideDialog;
