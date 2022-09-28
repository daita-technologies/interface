import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCurrentAnnotationProject } from "reduxes/annotationProject/action";
import { selectorAnnotationCurrentProject } from "reduxes/annotationProject/selector";
import UploadAnnotationImage from "./UploadAnnotationImage";

const annotationProjectDetail = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const dispatch = useDispatch();
  const annotationCurrentProject = useSelector(
    selectorAnnotationCurrentProject
  );

  useEffect(() => {
    dispatch(setCurrentAnnotationProject({ projectName }));

    return () => {
      dispatch(
        setCurrentAnnotationProject({
          projectName: "",
        })
      );
    };
  }, [location, projectName]);

  console.log(
    "annotationCurrentProject",
    projectName,
    annotationCurrentProject
  );
  return (
    <>
      <Box>
        <Box
          mt={2}
          p={2}
          display="flex"
          bgcolor="background.paper"
          borderRadius={2}
          flex={1}
        >
          {annotationCurrentProject && (
            <UploadAnnotationImage
              projectId={annotationCurrentProject.project_id}
              projectName={annotationCurrentProject.project_name}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
export default annotationProjectDetail;
