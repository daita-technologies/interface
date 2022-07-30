import { Box } from "@mui/material";
import { ControlPanel } from "components/Annotation";
import Editor from "./Editor/Editor";

const AnnotationPage = function () {
  return (
    <Box>
      <Box sx={{ height: "100vh" }}>
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
      </Box>
    </Box>
  );
};
export default AnnotationPage;
