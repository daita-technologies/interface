import React from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Switch,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectorAlbumMode,
  selectorIsDeletingImages,
  selectorSelectedList,
} from "reduxes/album/selector";
import { ALBUM_SELECT_MODE, ALBUM_VIEW_MODE } from "reduxes/album/constants";
import {
  changeAlbumMode,
  deleteImages,
  resetSelectedList,
} from "reduxes/album/action";
import { downloadSelectedFiles } from "reduxes/download/action";
import {
  selectorDownloadImagesLength,
  selectorIsDownloadingSelectedFiles,
  selectorIsZippingSelectedFiles,
} from "reduxes/download/selector";
import { InfoTooltip, MyButton } from "components";
import { selectorCurrentProjectId } from "reduxes/project/selector";
import { toast } from "react-toastify";

const SelectButton = function () {
  const dispatch = useDispatch();
  const projectId = useSelector(selectorCurrentProjectId);
  const albumMode = useSelector(selectorAlbumMode);
  const selectedList = useSelector(selectorSelectedList);

  const isDownloadingSelectedFiles = useSelector(
    selectorIsDownloadingSelectedFiles
  );
  const isZippingSelectedFiles = useSelector(selectorIsZippingSelectedFiles);

  const selectedDownloadedLength = useSelector(selectorDownloadImagesLength);

  const isDeletingImages = useSelector(selectorIsDeletingImages);

  const dowloadProgressValue = isDownloadingSelectedFiles
    ? (selectedDownloadedLength / selectedList.length) * 100
    : 0;

  const handleChangeAlbumMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      changeAlbumMode({
        albumMode: event.target.checked ? ALBUM_SELECT_MODE : ALBUM_VIEW_MODE,
      })
    );

    if (!event.target.checked) {
      dispatch(resetSelectedList());
    }
  };

  const isAlbumSelectMode = albumMode === ALBUM_SELECT_MODE;

  const onClickDownloadSelected = () => {
    toast.info(
      "Downloading images is in progress, please, do not close or refresh the page."
    );
    dispatch(downloadSelectedFiles({ selectedList, projectId }));
  };

  const onClickDeleteSelectedImages = () => {
    dispatch(
      deleteImages({
        imagesInfo: selectedList,
        projectId,
      })
    );
  };

  const renderSelectModeActions = () => {
    if (isAlbumSelectMode) {
      return (
        <>
          <Box>
            <Button
              color="primary"
              size="small"
              disabled={selectedList.length <= 0}
              onClick={onClickDownloadSelected}
            >
              Download{selectedList.length > 0 ? ` ${selectedList.length}` : ""}{" "}
              Selected
            </Button>
            {isDownloadingSelectedFiles && (
              <LinearProgress
                variant={
                  isZippingSelectedFiles ? "indeterminate" : "determinate"
                }
                color={isZippingSelectedFiles ? "success" : undefined}
                value={dowloadProgressValue}
              />
            )}
          </Box>
          <MyButton
            color="error"
            size="small"
            isLoading={!!isDeletingImages}
            disabled={selectedList.length <= 0}
            onClick={onClickDeleteSelectedImages}
          >
            Delete{selectedList.length > 0 ? ` ${selectedList.length}` : ""}{" "}
            Selected
          </MyButton>
        </>
      );
    }
    return null;
  };

  return (
    <Box display="flex" alignItems="center" columnGap={2}>
      <FormGroup>
        <FormControlLabel
          sx={{ fontSize: "12px" }}
          control={
            <Switch
              sx={{ fontSize: "12px" }}
              checked={isAlbumSelectMode}
              onChange={handleChangeAlbumMode}
              size="small"
            />
          }
          label={
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography component="span" variant="body2">
                Select Mode
              </Typography>
              <InfoTooltip
                sx={{ ml: 1 }}
                title={
                  <>
                    Select Mode: Choose the images to download or delete.
                    <br />
                    <strong>
                      <em>Switch to the normal mode</em>
                    </strong>{" "}
                    when you want to execute the other tasks.
                  </>
                }
              />
            </Box>
          }
        />
      </FormGroup>
      {renderSelectModeActions()}
    </Box>
  );
};

export default SelectButton;
