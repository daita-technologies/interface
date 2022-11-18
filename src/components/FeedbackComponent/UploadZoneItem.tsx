import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFeedBackAttachment } from "reduxes/feedback/action";
import { selectorAttachedFileFeedback } from "reduxes/feedback/selector";
import { UploadZoneProps } from "./type";

const UploadZoneItem = function ({ index }: UploadZoneProps) {
  const dropUploadAreaRef = useRef<HTMLElement | null>();
  const attachedFile = useSelector(selectorAttachedFileFeedback(index));
  const dispath = useDispatch();
  const fileThumb = useMemo(
    () => (attachedFile ? URL.createObjectURL(attachedFile) : null),
    [attachedFile]
  );
  const handleClickDelte = (event: React.MouseEvent<HTMLElement>) => {
    dispath(deleteFeedBackAttachment({ index }));
    event.stopPropagation();
  };
  const style = useMemo(() => {
    const commonStyle = {
      height: 75,
      width: 100,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "text.secondary",
    };
    if (fileThumb) {
      return {
        background: `url(${fileThumb}) no-repeat center`,
        backgroundSize: "cover",
        border: "2px solid",
        ...commonStyle,
      };
    }

    return {
      background: `url("/assets/images/upload-image.png") no-repeat center`,
      border: "1px solid",
      backgroundSize: 30,
      ...commonStyle,
    };
  }, [fileThumb]);
  return (
    <Box
      ref={dropUploadAreaRef}
      sx={{
        ...style,
      }}
      width="300px"
      position="relative"
    >
      <Box display="flex">
        {attachedFile && (
          <Box
            position="absolute"
            top={0}
            right={0}
            zIndex={99}
            sx={{ background: "white", borderRadius: 1 }}
          >
            <IconButton size="small" onClick={handleClickDelte}>
              <CloseIcon sx={{ fontSize: 12, color: "text.secondary" }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default UploadZoneItem;
