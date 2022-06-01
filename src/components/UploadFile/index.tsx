import { toast } from "react-toastify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, LinearProgress, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";

import { useDropzone } from "react-dropzone";
import { BeforeUnload } from "components";

import {
  addFile,
  checkFileUpload,
  clearAllFile,
  clearFileArray,
  deleteFile,
  resetUploadState,
  setTotalUploadFileQuantity,
  uploadFile,
} from "reduxes/upload/actions";

import { getLocalStorage } from "utils/general";
import {
  COMPRESS_FILE_EXTENSIONS,
  COMPRESS_IMAGE_EXTENSIONS,
  ID_TOKEN_NAME,
  MAX_ALLOW_UPLOAD_IMAGES,
  MAX_ALLOW_UPLOAD_IMAGES_AT_THE_SAME_TIME,
} from "constants/defaultValues";

import {
  ADDED_UPLOAD_FILE_STATUS,
  UPLOADED_UPLOAD_FILE_STATUS,
} from "constants/uploadFile";
import {
  selectorAddedStatusFileCount,
  selectorIsChecking,
  selectorIsUploading,
  selectorQueueingFileCount,
  selectorUploadedFileCount,
  selectorUploadErrorMessage,
  selectorUploadFiles,
  selectorUploadingFileCount,
} from "reduxes/upload/selector";
import {
  selectorCurrentProjectTotalOriginalImage,
  selectorHaveTaskRunning,
} from "reduxes/project/selector";
import { selectorIsAlbumSelectMode } from "reduxes/album/selector";
import {
  selectorIsGenerateImagesAugmenting,
  selectorIsGenerateImagesPreprocessing,
} from "reduxes/generate/selector";
import { MousePosition, UploadFileProps } from "./type";
import UploadFileItem from "./UploadFileItem";

import UploadFromMenu from "./UploadFromMenu";
import UploadGuideDialog from "./UploadGuideDialog";

interface HandleFileType {
  name: string;
  file: File;
  status: string;
  uploadProgress?: number;
  error?: string;
}

interface UploadFilesType {
  [fileName: string]: HandleFileType;
}

const convertArrayToObjectKeyFile = (files: Array<File>): UploadFilesType => {
  const returnObject: UploadFilesType = {};
  files.forEach((file: File) => {
    returnObject[file.name] = {
      name: file.name,
      file,
      status: ADDED_UPLOAD_FILE_STATUS,
      uploadProgress: 0,
    };
  });
  return returnObject;
};

const dropZoneBaseStyle = {
  opacity: 1,
};

const dropZoneDisabledStyle = {
  opacity: 0.5,
};
const FILE_UPLOAD_EXTENSIONS = [
  ...COMPRESS_IMAGE_EXTENSIONS,
  ...COMPRESS_FILE_EXTENSIONS,
];
const UploadFile = function (props: UploadFileProps) {
  const { projectId, projectName } = props;

  const dispatch = useDispatch();

  const uploadFiles = useSelector(selectorUploadFiles);

  const uploadFilesLength = Object.keys(uploadFiles).length;

  const uploadErrorMessage = useSelector(selectorUploadErrorMessage);

  const queueingFileCount = useSelector(selectorQueueingFileCount);

  const uploadingFileCount = useSelector(selectorUploadingFileCount);

  const uploadedFileCount = useSelector(selectorUploadedFileCount);

  const addedStatusFileCount = useSelector(selectorAddedStatusFileCount);

  const isUploadChecking = useSelector(selectorIsChecking);

  const isUploading = useSelector(selectorIsUploading);

  const haveTaskRunning = useSelector(selectorHaveTaskRunning);

  const isAlbumSelectMode = useSelector(selectorIsAlbumSelectMode);

  const isGenerateImagesPreprocessing = useSelector(
    selectorIsGenerateImagesPreprocessing
  );

  const isGenerateImagesAugmenting = useSelector(
    selectorIsGenerateImagesAugmenting
  );

  const totalOriginalImage = useSelector(
    selectorCurrentProjectTotalOriginalImage
  );
  const [isOpenUploadGuideDialog, setIsOpenUploadGuideDialog] = useState(false);
  const isDisabledUpload = useMemo(
    () =>
      isUploadChecking ||
      isUploading ||
      haveTaskRunning ||
      isAlbumSelectMode ||
      !!isGenerateImagesPreprocessing ||
      !!isGenerateImagesAugmenting,
    [
      isUploadChecking,
      isUploading,
      haveTaskRunning,
      isAlbumSelectMode,
      isGenerateImagesPreprocessing,
      isGenerateImagesAugmenting,
    ]
  );

  const uploadingProgress = Number(
    queueingFileCount + uploadingFileCount !== 0
      ? (
          (uploadedFileCount * 100) /
          (queueingFileCount + uploadingFileCount + uploadedFileCount)
        ).toFixed(0)
      : 0
  );

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      if (acceptedFiles.length > MAX_ALLOW_UPLOAD_IMAGES_AT_THE_SAME_TIME) {
        toast.error(
          <p>
            The maximum number of uploaded images in a project at the same time
            is {MAX_ALLOW_UPLOAD_IMAGES_AT_THE_SAME_TIME}. Please, re-upload
            with less than the number of image images.
          </p>
        );
        return;
      }
      if (acceptedFiles.length + totalOriginalImage > MAX_ALLOW_UPLOAD_IMAGES) {
        toast.warning(
          <p>
            The maximum number of images in a project is{" "}
            {MAX_ALLOW_UPLOAD_IMAGES}. Please, CANCEL the process to re-upload
            or DELETE some images in the original dataset.
          </p>
        );
      }
      const formatedFiles = convertArrayToObjectKeyFile(acceptedFiles);
      const files = { ...uploadFiles, ...formatedFiles };
      dispatch(addFile({ files: formatedFiles }));

      if (files && Object.keys(files).length > 0) {
        const filesNeedCheck: Array<string> = [];

        Object.keys(files).forEach((fileName: string) => {
          if (files[fileName].status !== UPLOADED_UPLOAD_FILE_STATUS) {
            filesNeedCheck.push(fileName);
          }
        });

        dispatch(
          checkFileUpload({
            idToken: getLocalStorage(ID_TOKEN_NAME) || "",
            projectId,
            projectName,
            listFileName: filesNeedCheck,
          })
        );
      }
    }
  }, []);
  const onClickClearAll = () => {
    dispatch(clearAllFile());
  };

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    accept: FILE_UPLOAD_EXTENSIONS.join(","),
    disabled: isDisabledUpload,
  });

  const dropZoneStyle = useMemo(
    () => ({
      ...dropZoneBaseStyle,
      ...(isDisabledUpload ? dropZoneDisabledStyle : {}),
    }),
    [isDisabledUpload]
  );

  const onDeleteFile = (fileName: string) => {
    if (uploadFiles && uploadFiles[fileName]) {
      let isUploadSucess = true;
      Object.keys(uploadFiles).forEach((name) => {
        if (
          name !== fileName &&
          uploadFiles[name].status !== UPLOADED_UPLOAD_FILE_STATUS
        )
          isUploadSucess = false;
      });
      if (isUploadSucess) {
        dispatch(clearFileArray({ fileNameArray: Object.keys(uploadFiles) }));
        dispatch(setTotalUploadFileQuantity({ totalUploadFileQuantity: null }));
      } else {
        dispatch(deleteFile({ fileName }));
      }
    }
  };

  const onReplaceUpload = (fileName: string) => {
    dispatch(setTotalUploadFileQuantity({ totalUploadFileQuantity: 1 }));
    dispatch(
      uploadFile({
        fileName,
        projectId,
        projectName,
        isReplace: true,
        isReplaceSingle: true,
      })
    );
  };

  useEffect(
    () => () => {
      dispatch(resetUploadState());
    },
    []
  );
  const [isOpenChooseFileMenu, setIsOpenChooseFileMenu] =
    useState<boolean>(false);
  const [relativeMousePosition, setRelativeMousePosition] =
    useState<MousePosition>({ top: 0, left: 0 });
  const handleCloseChooseFileMenu = () => {
    setIsOpenChooseFileMenu(false);
  };
  const dropUploadAreaRef = useRef<HTMLElement | null>();

  const handleClickDropUploadArea = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRelativeMousePosition({ top: y, left: x });
    setIsOpenChooseFileMenu(true);
  };

  const renderDropzoneContent = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {isDragActive ? (
        <DownloadIcon sx={{ fontSize: 60 }} />
      ) : (
        <UploadIcon sx={{ fontSize: 60 }} />
      )}
      <Typography sx={{ marginTop: 2 }} textAlign="center">
        {isDragActive
          ? "Drop your images here!"
          : "Drop your images here or click to upload"}
      </Typography>
      <Typography fontStyle="italic" variant="body2" color="text.secondary">
        {FILE_UPLOAD_EXTENSIONS.join(" ,")}
      </Typography>
      <Typography
        sx={{ mt: 1 }}
        textAlign="center"
        fontStyle="italic"
        variant="body2"
        color="text.secondary"
      >
        The number of images that can be uploaded is limited to{" "}
        {MAX_ALLOW_UPLOAD_IMAGES}.
      </Typography>
    </Box>
  );

  const renderUploadFileContent = () => {
    if (uploadFiles && Object.keys(uploadFiles).length > 0) {
      return (
        <Box sx={{ overflowY: "auto" }} maxHeight={400}>
          {Object.keys(uploadFiles).map((fileName: string) => (
            <UploadFileItem
              key={`upload-file-item-${uploadFiles[fileName].name}`}
              file={uploadFiles[fileName].file}
              status={uploadFiles[fileName].status}
              error={uploadFiles[fileName].error}
              uploadProgress={uploadFiles[fileName].uploadProgress}
              onClickDelete={onDeleteFile}
              onClickReplaceUpload={onReplaceUpload}
              isUploading={isUploading}
            />
          ))}
        </Box>
      );
    }

    return null;
  };

  const handleClickShowUploadGuideDialog = () => {
    setIsOpenUploadGuideDialog(true);
  };
  const handleCloseUploadGuideDialog = () => {
    setIsOpenUploadGuideDialog(false);
  };
  return (
    <Box my={4}>
      <BeforeUnload
        isActive={isUploadChecking || isUploading}
        message={`We are currently processing your data upload.\r\nAre you sure you want to quit?`}
      />

      {uploadErrorMessage && (
        <Box my={1} textAlign="right">
          <Typography variant="body2" color="error">
            {uploadErrorMessage}
          </Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="center" alignItems="stretch">
        <Box>
          <UploadFromMenu
            isDisabledUpload={isDisabledUpload}
            inputRef={inputRef}
            anchorEl={dropUploadAreaRef?.current}
            relativeMousePosition={relativeMousePosition}
            isOpen={isOpenChooseFileMenu}
            onClose={handleCloseChooseFileMenu}
          />
        </Box>

        <Box flex={1} ref={dropUploadAreaRef}>
          <Box
            sx={{
              width: "100%",
              height: 300,
              padding: 4,
              backgroundColor: "background.paper",
              border: "1px dashed",
              borderColor: isDragActive ? "primary.main" : "text.secondary",
              borderWidth: isDragActive ? 2 : 1,
              cursor: "pointer",
              borderRadius: "6px",
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            {...getRootProps({
              onClick: (event) => {
                handleClickDropUploadArea(event);
                event.stopPropagation();
              },
              style: dropZoneStyle,
            })}
            mr={2}
          >
            <input {...getInputProps()} multiple />
            {renderDropzoneContent()}
          </Box>
          <Typography mt={1} fontStyle="italic" variant="body2" fontSize={14}>
            * If you would like to upload your dataset programmatically,{" "}
            <Typography
              component="span"
              sx={{ cursor: "pointer", fontWeight: "bold", color: "#1c68dc" }}
              onClick={handleClickShowUploadGuideDialog}
              fontSize={14}
            >
              click here{" "}
            </Typography>
            for more information.
          </Typography>
          <UploadGuideDialog
            onClose={handleCloseUploadGuideDialog}
            isOpen={isOpenUploadGuideDialog}
          />
        </Box>

        <Box flex={2} ml={2}>
          <Box mb={4} display="flex">
            <Button
              sx={{
                alignSelf: "flex-start",
                color: "text.primary",
                borderColor: "text.primary",
              }}
              variant="outlined"
              disabled={
                uploadFilesLength <= 0 ||
                uploadingFileCount > 0 ||
                isUploadChecking ||
                isUploading
              }
              onClick={onClickClearAll}
            >
              Clear All
            </Button>
          </Box>

          {uploadFilesLength > 0 &&
            totalOriginalImage + addedStatusFileCount >
              MAX_ALLOW_UPLOAD_IMAGES && (
              <Box>
                <Typography color="error" variant="body2">
                  {totalOriginalImage + addedStatusFileCount} /{" "}
                  {MAX_ALLOW_UPLOAD_IMAGES} Images
                </Typography>
              </Box>
            )}
          {!!uploadingFileCount &&
            uploadingProgress >= 0 &&
            uploadingProgress < 100 && (
              <Box display="flex" alignItems="center">
                <Box sx={{ width: "calc(100% - 35px)" }} mr={1} my={1}>
                  <LinearProgress
                    value={uploadingProgress}
                    variant="determinate"
                  />
                </Box>

                <Box minWidth={35}>
                  <Typography variant="body2">{uploadingProgress}%</Typography>
                </Box>
              </Box>
            )}
          {renderUploadFileContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadFile;
