import { Box, CircularProgress, Typography } from "@mui/material";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchDetailAnnotationProjects,
  setCurrentAnnotationProject,
} from "reduxes/annotationProject/action";
import { selectorAnnotationCurrentProject } from "reduxes/annotationProject/selector";
import { getLocalStorage } from "utils/general";
import AnnotationEditor from "./AnnotationEditor";

const AnnotationPage = function () {
  const dispatch = useDispatch();
  const { projectName } = useParams<{ projectName: string }>();
  const annotationCurrentProject = useSelector(
    selectorAnnotationCurrentProject
  );

  useEffect(() => {
    if (!annotationCurrentProject) {
      dispatch(setCurrentAnnotationProject({ projectName }));
      dispatch(
        fetchDetailAnnotationProjects({
          idToken: getLocalStorage(ID_TOKEN_NAME),
          projectName: projectName || "",
        })
      );
    }
  }, [projectName]);
  const renderContent = () => {
    if (annotationCurrentProject) {
      return <AnnotationEditor />;
    }
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flex={1}
        py={14}
      >
        <CircularProgress size={20} />
        <Typography mt={1}>Fetching project information...</Typography>
      </Box>
    );
  };
  return <Box>{renderContent()}</Box>;
};
export default AnnotationPage;
