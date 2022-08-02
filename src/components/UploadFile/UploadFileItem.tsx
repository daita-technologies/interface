import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { CircularProgressWithLabel, MyButton } from "components";
import {
  ADDED_UPLOAD_FILE_STATUS,
  CHECKING_UPLOAD_FILE_STATUS,
  FAILED_UPLOAD_FILE_STATUS,
  INVALID_FILE_STATUS,
  QUEUEING_UPLOAD_FILE_STATUS,
  UPLOADED_UPLOAD_FILE_STATUS,
  UPLOADING_UPLOAD_FILE_STATUS,
} from "constants/uploadFile";
import { useSelector } from "react-redux";
import { RootState } from "reduxes";
import { formatBytes } from "utils/general";
import { UploadFileItemProps } from "./type";

function UploadFileItem(props: UploadFileItemProps) {
  const { fileName, onClickDelete, onClickReplaceUpload, isUploading, style } =
    props;

  const { file, status, error, uploadProgress } = useSelector(
    (state: RootState) => state.uploadReducer.files[fileName]
  );
  const deleteButton = (
    <Box>
      <IconButton onClick={() => onClickDelete(file.name)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  const returnStatus = () => {
    switch (status) {
      case CHECKING_UPLOAD_FILE_STATUS:
        return (
          <Box maxWidth={80} textAlign="center">
            <Typography fontSize={14} color="text.secondary">
              Checking...
            </Typography>
            <LinearProgress />
          </Box>
        );
      case UPLOADING_UPLOAD_FILE_STATUS:
        return (
          <Box>
            <CircularProgressWithLabel size={40} value={uploadProgress || 0} />
          </Box>
        );
      case UPLOADED_UPLOAD_FILE_STATUS:
        return (
          <Box textAlign="center">
            <Typography fontSize={14} color="success.main">
              Uploaded
            </Typography>
            <CheckIcon color="success" />
          </Box>
        );
      case FAILED_UPLOAD_FILE_STATUS:
        return (
          <Box display="flex" alignItems="center">
            <MyButton
              onClick={() => onClickReplaceUpload(file.name)}
              startIcon={<FileCopyIcon />}
              variant="outlined"
              disabled={isUploading}
            >
              Replace
            </MyButton>
            <IconButton
              sx={{ marginLeft: 1 }}
              onClick={() => onClickDelete(file.name)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      case QUEUEING_UPLOAD_FILE_STATUS:
        return deleteButton;
      case INVALID_FILE_STATUS:
        return deleteButton;
      case ADDED_UPLOAD_FILE_STATUS:
      default:
        return deleteButton;
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py={2}
      borderBottom="1px solid"
      borderColor="text.secondary"
      style={{ ...style }}
    >
      <Box>
        <Typography fontWeight="bold">{file.name}</Typography>
        {error ? (
          <Typography fontSize={14} color="error">
            {error}
          </Typography>
        ) : (
          <Typography fontSize={14} color="text.secondary">
            {new Date(file.lastModified).toDateString()}
            {" • "}
            {formatBytes(file.size)}
          </Typography>
        )}
      </Box>
      {returnStatus()}
    </Box>
  );
}

export default UploadFileItem;
