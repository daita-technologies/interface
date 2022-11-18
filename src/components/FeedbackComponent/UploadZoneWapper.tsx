import { Box } from "@mui/material";
import { IMAGE_EXTENSIONS } from "constants/defaultValues";
import { useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { selectorAttachedFilesFeedback } from "reduxes/feedback/selector";
import UploadZoneItem from "./UploadZoneItem";

const UploadZoneWrapper = function ({
  isProcessing,
  onDrop,
}: {
  isProcessing: boolean;
  onDrop: (acceptedFiles: File[]) => void;
}) {
  const attachedFiles = useSelector(selectorAttachedFilesFeedback);
  const dropUploadAreaRef = useRef<HTMLElement | null>();

  const dropZone = useDropzone({
    onDrop,
    accept: IMAGE_EXTENSIONS.join(","),
    disabled: isProcessing,
    noDragEventsBubbling: true,
  });
  const { getRootProps, getInputProps } = dropZone;
  const dropZoneBaseStyle = {
    opacity: 1,
  };

  const dropZoneDisabledStyle = {
    opacity: 0.5,
  };
  const dropZoneStyle = useMemo(
    () => ({
      ...dropZoneBaseStyle,
      ...(isProcessing ? dropZoneDisabledStyle : {}),
    }),
    [isProcessing]
  );

  return (
    <Box ref={dropUploadAreaRef}>
      <Box
        display="flex"
        sx={{
          width: "100%",
          height: 100,
          backgroundColor: "background.paper",
          padding: "12px",
          border: "1px dashed",
          borderColor: "text.secondary",
          cursor: "pointer",
          borderRadius: "6px",
          boxSizing: "boder-box",
        }}
        {...getRootProps({
          style: dropZoneStyle,
        })}
      >
        <input {...getInputProps()} />
        <Box display="flex" justifyContent="space-between" width="100%">
          {attachedFiles.map((attachedFile, index) => (
            <UploadZoneItem
              key={`attach-file-${
                attachedFile ? `${index}-${attachedFile.name}` : index
              }`}
              index={index}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default UploadZoneWrapper;
