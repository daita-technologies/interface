import { Badge, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectorCurrentAnnotationFiles } from "reduxes/annotationProject/selector";

function ImagePreviewBadge({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  const currentAnnotationFiles = useSelector(selectorCurrentAnnotationFiles);
  const renderCBadgeContent = () => <Box sx={{ color: "white" }}>AI</Box>;
  if (currentAnnotationFiles) {
    const annotationFile = currentAnnotationFiles.items.find(
      (t) => t.filename === filename
    );
    if (annotationFile) {
      if (annotationFile.s3_key_segm) {
        return (
          <Badge badgeContent={renderCBadgeContent()} color="success">
            {children}
          </Badge>
        );
      }
    }
  }
  return <> {children}</>;
}
export default ImagePreviewBadge;
