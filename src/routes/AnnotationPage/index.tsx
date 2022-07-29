import { Box } from "@mui/material";
import { ControlPanel } from "components/Annotation";
import Editor from "./Editor/Editor";

const AnnotationPage = function () {
  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" gap={0} flex={10}>
          <Box sx={{ border: "1px solid white" }} flex={1}>
            <Box sx={{ minWidth: 100, flexGrow: 1, padding: 3 }}>
              <ControlPanel />
            </Box>
          </Box>
          <Box sx={{ border: "1px solid white" }} flex={7}>
            <Editor />
          </Box>
          <Box sx={{ border: "1px solid white" }} flex={2}>
            {" "}
            aaaaa
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default AnnotationPage;
