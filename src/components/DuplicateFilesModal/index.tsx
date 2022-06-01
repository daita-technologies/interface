import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { INVALID_FILE_STATUS, QUEUEING_UPLOAD_FILE_STATUS } from "constants/uploadFile";
import { useDispatch, useSelector } from "react-redux";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
} from "reduxes/project/selector";
import {
  clearFileArray,
  setIsOpenDuplicateModal,
  setTotalUploadFileQuantity,
  updateStatusFileArray,
  uploadFile,
} from "reduxes/upload/actions";
import {
  selectorIsOpenDuplicateModal,
  selectorUploadFiles,
} from "reduxes/upload/selector";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";

const DuplicateFilesModal = function () {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectorIsOpenDuplicateModal);

  const uploadFiles = useSelector(selectorUploadFiles);

  const projectId = useSelector(selectorCurrentProjectId);
  const projectName = useSelector(selectorCurrentProjectName);

  const handleClose = () =>
    dispatch(setIsOpenDuplicateModal({ isOpen: false }));

  const onClickSkipAll = () => {
    if (uploadFiles) {
      const fileNameArray = Object.keys(uploadFiles);
      if (fileNameArray.length > 0) {
        handleClose();
        const duplicateFileNameArray: Array<string> = [];
        fileNameArray.forEach((fileName: string) => {
          if (uploadFiles[fileName].error) {
            duplicateFileNameArray.push(fileName);
          }
        });

        dispatch(
          setTotalUploadFileQuantity({
            totalUploadFileQuantity:
              fileNameArray.length - duplicateFileNameArray.length,
          })
        );

        dispatch(
          clearFileArray({
            fileNameArray: duplicateFileNameArray,
          })
        );

        fileNameArray.forEach((fileName: string) => {
          if (!uploadFiles[fileName].error) {
            dispatch(
              uploadFile({
                fileName,
                projectId,
                projectName,
                isReplace: true,
                isExist: false,
              })
            );
          }
        });
      }
    }
  };

  const onClickReplaceAll = () => {
    if (uploadFiles) {
      const fileNameArray = Object.keys(uploadFiles).filter(
        (fileName) => uploadFiles[fileName].status !== INVALID_FILE_STATUS
      );
      if (fileNameArray.length > 0) {
        handleClose();

        const duplicateFileNameArray: Array<string> = [];
        const newFileNameArray: Array<string> = [];

        fileNameArray.forEach((fileName: string) =>
          uploadFiles[fileName].error
            ? duplicateFileNameArray.push(fileName)
            : newFileNameArray.push(fileName)
        );

        dispatch(
          updateStatusFileArray({
            fileArray: fileNameArray,
            targetStatus: QUEUEING_UPLOAD_FILE_STATUS,
            isClearError: true,
          })
        );

        dispatch(
          setTotalUploadFileQuantity({
            totalUploadFileQuantity: fileNameArray.length,
          })
        );

        duplicateFileNameArray.forEach((fileName: string) => {
          dispatch(
            uploadFile({
              fileName,
              projectId,
              projectName,
              isReplace: true,
              isExist: true,
            })
          );
        });
        newFileNameArray.forEach((fileName: string) => {
          dispatch(
            uploadFile({ fileName, projectId, projectName, isExist: false })
          );
        });
      }
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{ ...modalStyle, width: 600 }}>
        <IconButton sx={modalCloseStyle} onClick={handleClose}>
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          Duplicate Files
        </Typography>
        <Typography mt={3} variant="body1">
          Some filenames are existing in this project.
          <br />
          Do you want to REPLACE or SKIP all of duplicate files?
          <br />
          You can also CANCEL this action to manually check the upload list.
        </Typography>

        <Box display="flex" mt={5}>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{ ml: "auto" }}
            variant="outlined"
            onClick={onClickSkipAll}
          >
            Skip All
          </Button>
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            color="primary"
            onClick={onClickReplaceAll}
          >
            Replace All
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DuplicateFilesModal;
