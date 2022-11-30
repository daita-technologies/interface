import {
  MAX_HEIGHT_EDITOR,
  MAX_WIDTH_EDITOR,
} from "components/Annotation/Editor/const";
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
  selectorAnnotationCurrentProjectName,
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
  const annotationCurrentProjectName = useSelector(
    selectorAnnotationCurrentProjectName
  );

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
  }, [annotationCurrentProjectName]);

  const renderContent = () => {
    if (
      currentAnnotationFiles &&
      annotationCurrentProject &&
      currentAnnotationFiles.projectId === annotationCurrentProject.project_id
    ) {
      return (
        <Box display="flex" flexDirection="column">
          <Box display="flex">
            <Box flexBasis="10%" sx={{ overflowY: "auto", minWidth: "240px" }}>
              <Box sx={{ padding: 3 }}>
                <ControlPanel />
              </Box>
            </Box>
            <Box
              sx={{ backgroundColor: "#101c2d" }}
              // flexBasis="70%"
              width={MAX_WIDTH_EDITOR}
              height={MAX_HEIGHT_EDITOR}
              margin="2px"
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
            sx={{ backgroundColor: "#2a3648" }}
            justifyContent="center"
            alignContent="center"
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
