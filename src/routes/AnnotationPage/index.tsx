import { Box } from "@mui/material";
import { ControlPanel } from "components/Annotation";
import Editor from "./Editor";
import ImagePreview from "./ImagePreview";

const AnnotationPage = function () {
  return (
    <Box>
      <Box display="flex" sx={{ height: "100vh" }} flexDirection="column">
        <Box display="flex">
          <Box display="flex" gap={0} flexGrow={2}>
            <Box sx={{}}>
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
            flexGrow={3}
          >
            <h1>Lable</h1>
          </Box>
        </Box>
        <ImagePreview />
      </Box>
    </Box>
  );
};
export default AnnotationPage;
