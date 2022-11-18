import { Box, CircularProgress } from "@mui/material";
import {
  MAX_HEIGHT_EDITOR,
  MAX_WIDTH_EDITOR,
} from "components/Annotation/Editor/const";
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
            sx={{ padding: 1, backgroundColor: "#2a3648" }}
          >
            <ImagePreview />
          </Box>
        </Box>
      );
    }
    return (
      <Box display="flex" alignItems="center" justifyContent="center" my={2}>
        <CircularProgress size={20} />
      </Box>
    );
  };
  return <Box>{renderContent()}</Box>;
};
export default AnnotationEditor;
