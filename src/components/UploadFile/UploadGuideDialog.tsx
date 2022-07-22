import { ContentCopy, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  Typography,
} from "@mui/material";
import MyButton from "components/common/MyButton";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectorUserInfo } from "reduxes/auth/selector";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
} from "reduxes/project/selector";
import { projectApi } from "services";
import { copy } from "utils/clipboard";

const DEFAULT_UPLOAD_TOKEN_VALUE = "Get your upload token now!";

const copyPopoverTextId = "copy-popover-text";

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

  const [isShowToken, setIsShowToken] = useState(false);
  const [uploadTokenValue, setUploadTokenValue] = useState(
    DEFAULT_UPLOAD_TOKEN_VALUE
  );

  const [isGettingToken, setIsGettingToken] = useState(false);

  const currentProjectId = useSelector(selectorCurrentProjectId);
  const currentProjectName = useSelector(selectorCurrentProjectName);

  const [copiedPopoverAnchorEl, setCopiedPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const isShowCopiedPopover = useMemo(
    () => Boolean(copiedPopoverAnchorEl),
    [copiedPopoverAnchorEl]
  );
  const handleCloseCopiedPopover = () => {
    setCopiedPopoverAnchorEl(null);
  };

  const handleClickShowToken = () => {
    setIsShowToken(!isShowToken);
  };

  const handleClickCopy = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const isCopied = await copy(uploadTokenValue);

    if (isCopied) {
      setCopiedPopoverAnchorEl(event.target as HTMLButtonElement);
      setTimeout(handleCloseCopiedPopover, 3000);
    } else {
      toast.error("Unable to copy.");
    }
  };

  const handleGetUploadToken = () => {
    setIsGettingToken(true);
    projectApi
      .getUploadToken({
        projectId: currentProjectId,
        projectName: currentProjectName,
      })
      .then((getUploadTokenResponse: any) => {
        setIsGettingToken(false);
        if (getUploadTokenResponse && getUploadTokenResponse.error === false) {
          setUploadTokenValue(getUploadTokenResponse.data.token);
        } else {
          toast.error("Unable to get upload token. Please try again later!");
        }
      });
  };

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ p: 4 }}>
        Upload your dataset programmatically
      </DialogTitle>
      <DialogContent sx={{ px: 4 }}>
        <DialogContentText pb={2} color="text.primary">
          <Typography variant="body2">
            Hi {userInfo ? userInfo.fullname : ""} 👋!
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
                fontFamily="Consolas,monaco,monospace"
                fontSize={14}
              >
                <p style={commentStyle}>
                  # ensure that you have installed our pip package in your
                  Python environment
                </p>
                <p style={generalStyle}>pip install daita </p>
                <br />
                <p style={commentStyle}>
                  # upload your dataset using the following command
                </p>
                <p style={commentStyle}>
                  # (don&apos;t forget to set `path_to_your_dataset`) daita
                  my-folder
                </p>
                <p style={{ ...generalStyle, whiteSpace: "nowrap" }}>
                  daita --dir{" "}
                  <span style={colorStringStyle}>path_to_your_dataset</span>{" "}
                  --daita_token{" "}
                  <span style={colorStringStyle}>your_upload_token</span>
                </p>
              </Box>
            </Typography>
          </Typography>
        </DialogContentText>
        <Box mt={4}>
          <Grid container columnSpacing={1} alignItems="center">
            <Grid item xs={9}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Upload Token</InputLabel>
                <OutlinedInput
                  type={isShowToken ? "text" : "password"}
                  value={uploadTokenValue}
                  readOnly
                  disabled={isGettingToken}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        id="copyPopoverTextId"
                        sx={{ mr: 1 }}
                        onClick={handleClickCopy}
                        edge="end"
                      >
                        <ContentCopy />
                      </IconButton>
                      <Popover
                        id={copyPopoverTextId}
                        open={isShowCopiedPopover}
                        anchorEl={copiedPopoverAnchorEl}
                        onClose={handleCloseCopiedPopover}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Typography sx={{ p: 1 }} variant="subtitle2">
                          Copied!
                        </Typography>
                      </Popover>
                      <IconButton
                        onClick={handleClickShowToken}
                        onMouseDown={handleClickShowToken}
                        edge="end"
                      >
                        {isShowToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Upload Token"
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <MyButton
                fullWidth
                variant="contained"
                isLoading={isGettingToken}
                onClick={handleGetUploadToken}
              >
                Get Upload Token
              </MyButton>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default UploadGuideDialog;
