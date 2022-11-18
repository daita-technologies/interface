import { Box, CircularProgress, Typography } from "@mui/material";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetAnnotation } from "reduxes/annotation/action";
import { resetAnnotationManager } from "reduxes/annotationmanager/action";
import {
  fetchAnnotationFiles,
  setAnnotationFiles,
} from "reduxes/annotationProject/action";
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
      dispatch(
        fetchAnnotationFiles({
          idToken: getLocalStorage(ID_TOKEN_NAME),
          nextToken: "",
          projectId: annotationCurrentProject.project_id,
        })
      );
    }
    return () => {
      dispatch(setAnnotationFiles({ annotationAndFileInfoApi: null }));
      dispatch(resetAnnotationManager());
      dispatch(resetAnnotation());
    };
  }, [annotationCurrentProject]);

  const renderContent = () => {
    if (
      currentAnnotationFiles &&
      annotationCurrentProject &&
      currentAnnotationFiles.projectId === annotationCurrentProject.project_id
    ) {
      return (
        <Box display="flex" sx={{ height: "100vh" }} flexDirection="column">
          <Box display="flex" height="85vh">
            <Box flexBasis="10%" sx={{ overflowY: "auto", minWidth: "240px" }}>
              <Box sx={{ padding: 3 }}>
                <ControlPanel />
              </Box>
            </Box>
            <Box
              sx={{ backgroundColor: "#101c2d" }}
              flexBasis="70%"
              padding="2px"
            >
              <Editor />
            </Box>
            {/* </Box> */}
            <Box sx={{ backgroundColor: "#313c4b" }} flexBasis="20%">
              <LabelAnnotation />
            </Box>
          </Box>
          <Box
            display="flex"
            gap={2}
            height="15vh"
            sx={{ padding: 1, backgroundColor: "#2a3648" }}
          >
            <ImagePreview />
          </Box>
        </Box>
      );
    }
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        my={2}
        py={12}
      >
        <CircularProgress size={20} />
        <Typography mt={1}>Initializing annotation editor...</Typography>
      </Box>
    );
  };
  return <Box>{renderContent()}</Box>;
};
export default AnnotationEditor;
