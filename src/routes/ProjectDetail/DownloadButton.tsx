import React from "react";
import { toast } from "react-toastify";
import {
  Box,
  LinearProgress,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { MyButton } from "components";
import {
  ALL_DOWNLOAD_TYPE,
  ID_TOKEN_NAME,
  PROGRESS_POOLING_INTERVAL,
} from "constants/defaultValues";
import {
  downloadZipEc2Create,
  downloadZipEc2Progress,
} from "reduxes/download/action";
import {
  selectorCurrentProjectIdDownloading,
  selectorDownloadImagesLength,
  selectorDownloadZipEc2TaskId,
  selectorIsDownloading,
  selectorIsDownloadingZipEc2,
  selectorIsZipping,
  selectorTotalNeedDownload,
} from "reduxes/download/selector";
import { getLocalStorage, switchTabIdToSource } from "utils/general";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
  selectorCurrentProjectTotalImage,
} from "reduxes/project/selector";
import { selectorActiveImagesTabId } from "reduxes/album/selector";
import useInterval from "hooks/useInterval";
import {
  selectorIsChecking,
  selectorIsUploading,
} from "reduxes/upload/selector";

const DownloadButton = function ({ projectId }: { projectId: string }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isUploadChecking = useSelector(selectorIsChecking);

  const isUploading = useSelector(selectorIsUploading);

  const isDownloading = useSelector(selectorIsDownloading);
  const isDownloadingZipEc2 = useSelector(selectorIsDownloadingZipEc2);
  const downloadImagesLength = useSelector(selectorDownloadImagesLength);

  const totalNeedDownload = useSelector(selectorTotalNeedDownload);
  const isZipping = useSelector(selectorIsZipping);

  const currentProjectTotalImage = useSelector(
    selectorCurrentProjectTotalImage
  );

  const currentProjectId = useSelector(selectorCurrentProjectId);
  const currentProjectIdDownloading = useSelector(
    selectorCurrentProjectIdDownloading
  );

  const currentProjectName = useSelector(selectorCurrentProjectName);

  const activeImagesTabId = useSelector(selectorActiveImagesTabId);
  const currentOpeningTabData = switchTabIdToSource(activeImagesTabId);

  const tempTotal = totalNeedDownload || currentProjectTotalImage;

  const downloadZipEc2TaskId = useSelector(selectorDownloadZipEc2TaskId);

  const progressValue = tempTotal
    ? (downloadImagesLength / tempTotal) * 100
    : 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickDownloadAll = () => {
    handleClose();
    if (currentProjectTotalImage > 0) {
      toast.info(
        <Box>
          <Typography fontSize={14}>
            We are zipping your file and creating a download link. You will
            receive an automatic email notification when finished. You can also
            check the current status in{" "}
            <a className="text-link" href={`/my-task/${currentProjectName}`}>
              &quot;My Tasks&quot;
            </a>
            .
          </Typography>
        </Box>
      );
      dispatch(
        downloadZipEc2Create({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          projectId,
          projectName: currentProjectName,
          downType: ALL_DOWNLOAD_TYPE,
        })
      );
      // dispatch(
      //   downloadAllFiles({
      //     idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      //     projectId,
      //   })
      // );
    } else {
      toast.info("You don't have any images to download.");
    }
  };

  const onClickDownloadOpeningTab = () => {
    handleClose();
    if (currentProjectTotalImage > 0) {
      toast.info(
        <Box>
          <Typography fontSize={14}>
            We are zipping your file and creating a download link. You will
            receive an automatic email notification when finished. You can also
            check the current status in{" "}
            <a className="text-link" href={`/my-task/${currentProjectName}`}>
              &quot;My Tasks&quot;
            </a>
            .
          </Typography>
        </Box>
      );
      dispatch(
        downloadZipEc2Create({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          projectId,
          projectName: currentProjectName,
          downType: currentOpeningTabData,
        })
      );
      // dispatch(
      //   downloadAllFiles({
      //     idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      //     projectId,
      //     targetImageSource: currentOpeningTabData,
      //   })
      // );
    } else {
      toast.info("You don't have any images to download.");
    }
  };

  useInterval(
    () => {
      if (downloadZipEc2TaskId) {
        dispatch(
          downloadZipEc2Progress({
            taskId: downloadZipEc2TaskId,
          })
        );
      }
    },
    downloadZipEc2TaskId ? PROGRESS_POOLING_INTERVAL : null
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <MyButton
        startIcon={<DownloadIcon />}
        isLoading={
          !!isDownloading && currentProjectId === currentProjectIdDownloading
        }
        disabled={isUploadChecking || isUploading}
        onClick={handleClick}
      >
        Download
      </MyButton>

      <Menu
        sx={{ mt: 1 }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={onClickDownloadOpeningTab}>
          <ListItemText>Download the viewed tab data</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickDownloadAll}>Download all</MenuItem>
      </Menu>

      {isDownloading &&
        !isDownloadingZipEc2 &&
        currentProjectId === currentProjectIdDownloading && (
          <LinearProgress
            variant={isZipping ? "indeterminate" : "determinate"}
            color={isZipping ? "success" : undefined}
            value={progressValue}
          />
        )}
      {isDownloading &&
        isDownloadingZipEc2 &&
        currentProjectId === currentProjectIdDownloading && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontStyle="italic"
            >
              Preparing download...
            </Typography>
          </Box>
        )}
    </Box>
  );
};

export default DownloadButton;
