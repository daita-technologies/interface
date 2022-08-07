import { Box } from "@mui/material";
import ControlPanel from "./ControlPanel";
import Editor from "./Editor";
import ImagePreview from "./ImagePreview";
import LabelAnnotation from "./LabelAnnotation";

const AnnotationPage = function () {
  return (
    <Box>
      <Box display="flex" sx={{ height: "100vh" }} flexDirection="column">
        <Box display="flex">
          <Box display="flex" gap={0} flexGrow={2}>
            <Box>
              <Box sx={{ minWidth: 100, padding: 3 }}>
                <ControlPanel />
              </Box>
            </Box>
            <Box sx={{ backgroundColor: "#101c2d" }} flexGrow={10}>
              <Editor />
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            sx={{ backgroundColor: "#313c4b" }}
            width={50}
            flexGrow={5}
          >
            <LabelAnnotation />
          </Box>
        </Box>
        <ImagePreview />
      </Box>
    </Box>
  );
};
export default AnnotationPage;
