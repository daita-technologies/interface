import { Box, CircularProgress } from "@mui/material";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnotationFiles } from "reduxes/annotationProject/action";
import {
  selectorAnnotationCurrentProject,
  selectorCurrentAnnotationFiles,
} from "reduxes/annotationProject/selector";
import { getLocalStorage } from "utils/general";
import ControlPanel from "./ControlPanel";
import Editor from "./Editor";
import ImagePreview from "./ImagePreview";
import LabelAnnotation from "./LabelAnnotation";

const AnnotationEditor = function () {
  const dispatch = useDispatch();
  const annotationCurrentProject = useSelector(
    selectorAnnotationCurrentProject
  );
  const currentAnnotationFiles = useSelector(selectorCurrentAnnotationFiles);

  useEffect(() => {
    if (annotationCurrentProject) {
      if (
        currentAnnotationFiles &&
        currentAnnotationFiles.next_token.project_id ===
          annotationCurrentProject?.project_id
      ) {
        dispatch(
          fetchAnnotationFiles({
            idToken: getLocalStorage(ID_TOKEN_NAME),
            nextToken: currentAnnotationFiles.next_token.filename,
            projectId: annotationCurrentProject.project_id,
          })
        );
      } else {
        dispatch(
          fetchAnnotationFiles({
            idToken: getLocalStorage(ID_TOKEN_NAME),
            nextToken: "",
            projectId: annotationCurrentProject.project_id,
          })
        );
      }
    }
  }, [annotationCurrentProject]);

  const renderContent = () => {
    if (
      currentAnnotationFiles &&
      annotationCurrentProject &&
      currentAnnotationFiles.projectId === annotationCurrentProject.project_id
    ) {
      return (
        <Box display="flex" sx={{ height: "100vh" }} flexDirection="column">
          <Box display="flex">
            <Box display="flex" gap={0} flexGrow={2}>
              <Box>
                <Box sx={{ minWidth: 100, padding: 3, maxWidth: 200 }}>
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
              flexGrow={10}
            >
              <LabelAnnotation />
            </Box>
          </Box>
          <ImagePreview />
        </Box>
      );
    } else {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" my={2}>
          <CircularProgress size={20} />
        </Box>
      );
    }
  };
  return <Box>{renderContent()}</Box>;
};
export default AnnotationEditor;
