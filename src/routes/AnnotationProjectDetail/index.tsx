import { LegendToggleSharp } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  AUGMENT_SOURCE,
  GENERATING_SAMPLE_PROJECT_STATUS,
  ID_TOKEN_NAME,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
} from "constants/defaultValues";
import { ANNOTATION_EDITOR_ROUTE_NAME } from "constants/routeName";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  fetchDetailAnnotationProjects,
  fetchListAnnotationProjects,
  setCurrentAnnotationProject,
} from "reduxes/annotationProject/action";
import {
  selectorAnnotationCurrentProject,
  selectorIsFetchingDetailAnnotationProject,
} from "reduxes/annotationProject/selector";
import { formatBytes, getLocalStorage, separateNumber } from "utils/general";

const annotationProjectDetail = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const history = useHistory();

  const dispatch = useDispatch();
  const annotationCurrentProject = useSelector(
    selectorAnnotationCurrentProject
  );
  const isFetchingDetailAnnotationProject = useSelector(
    selectorIsFetchingDetailAnnotationProject
  );
  useEffect(() => {
    dispatch(setCurrentAnnotationProject({ projectName }));
    dispatch(
      fetchDetailAnnotationProjects({
        idToken: getLocalStorage(ID_TOKEN_NAME),
        projectName: projectName || "",
      })
    );
    return () => {
      dispatch(
        setCurrentAnnotationProject({
          projectName: "",
        })
      );
    };
  }, [location, projectName]);

  useEffect(() => {
    if (
      annotationCurrentProject &&
      annotationCurrentProject.gen_status === GENERATING_SAMPLE_PROJECT_STATUS
    ) {
      const timer = setTimeout(() => {
        dispatch(
          fetchDetailAnnotationProjects({
            idToken: getLocalStorage(ID_TOKEN_NAME),
            projectName: projectName || "",
          })
        );
        dispatch(
          fetchListAnnotationProjects({
            idToken: getLocalStorage(ID_TOKEN_NAME),
          })
        );
      }, 1 * 10 * 1000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {};
  }, [annotationCurrentProject]);
  const renderContent = () => {
    let totalOriginalImage = 0;
    let totalPreprocessImage = 0;
    let totalAugmentImage = 0;

    let totalOriginalSize = 0;
    let totalPreprocessSize = 0;
    let totalAugmentSize = 0;
    if (annotationCurrentProject) {
      const originalSourceInfo =
        annotationCurrentProject.groups[ORIGINAL_SOURCE];
      if (originalSourceInfo) {
        totalOriginalImage = originalSourceInfo.count;
        totalOriginalSize = originalSourceInfo.size;
      }
      const preprocessSourceInfo =
        annotationCurrentProject.groups[PREPROCESS_SOURCE];
      if (preprocessSourceInfo) {
        totalPreprocessImage = preprocessSourceInfo.count;
        totalPreprocessSize = preprocessSourceInfo.size;
      }

      const augmentSourceInfo = annotationCurrentProject.groups[AUGMENT_SOURCE];
      if (augmentSourceInfo) {
        totalPreprocessImage = augmentSourceInfo.count;
        totalPreprocessSize = augmentSourceInfo.size;
      }
    }
    return (
      <>
        <Box flex={1} mr={1}>
          <Typography fontSize={18} fontWeight="bold">
            Data
          </Typography>
          <Typography fontSize={14}>Original</Typography>
          <Typography fontSize={14}>Preprocessing</Typography>
          <Typography fontSize={14}>Augmentation</Typography>
          <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
          <Typography fontSize={18} fontWeight="bold">
            Total
          </Typography>
        </Box>
        <Box flex={1} mr={1}>
          <Typography fontSize={18} fontWeight="bold">
            Number of Images
          </Typography>
          <Typography fontSize={14}>
            {separateNumber(totalOriginalImage.toString())}
          </Typography>
          <Typography fontSize={14}>
            {separateNumber(totalPreprocessImage.toString())}
          </Typography>
          <Typography fontSize={14}>
            {separateNumber(totalAugmentImage.toString())}
          </Typography>
          <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
          <Typography fontSize={18} fontWeight="bold">
            {separateNumber(
              (
                totalOriginalImage +
                totalPreprocessImage +
                totalAugmentImage
              ).toString()
            )}
          </Typography>
        </Box>

        <Box flex={1} ml={1}>
          <Typography fontSize={18} fontWeight="bold">
            Dataset Storage
          </Typography>
          <Typography fontSize={14}>
            {formatBytes(totalOriginalSize)}
          </Typography>
          <Typography fontSize={14}>
            {formatBytes(totalPreprocessSize)}
          </Typography>
          <Typography fontSize={14}>{formatBytes(totalAugmentSize)}</Typography>
          <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
          <Typography fontSize={18} fontWeight="bold">
            {formatBytes(
              totalOriginalSize + totalPreprocessSize + totalAugmentSize
            )}
          </Typography>
        </Box>
      </>
    );
    // if (annotationCurrentProjectName && annotationCurrentProject) {
    //   return (
    //     <UploadAnnotationImage
    //       projectId={annotationCurrentProject.project_id}
    //       projectName={annotationCurrentProject.project_name}
    //     />
    //   );
    // }
  };
  const handleAnnotateProjectClick = () => {
    history.push(`/${ANNOTATION_EDITOR_ROUTE_NAME}/${projectName}`);
  };
  const renderProject = () => {
    if (
      annotationCurrentProject &&
      annotationCurrentProject.gen_status === GENERATING_SAMPLE_PROJECT_STATUS
    ) {
      return (
        <Box mt={4}>
          <Typography sx={{ mb: 2 }}>
            The project is being built, please come back in a few minutes...
          </Typography>
          <LinearProgress />
        </Box>
      );
    }
    if (
      isFetchingDetailAnnotationProject === null ||
      isFetchingDetailAnnotationProject === true
    ) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
          py={6}
        >
          <CircularProgress size={20} />
        </Box>
      );
    }
    return (
      <Box>
        <Box
          mt={2}
          p={2}
          display="flex"
          bgcolor="background.paper"
          borderRadius={2}
          flex={1}
        >
          {renderContent()}
        </Box>
        <Box mt={10} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="success"
            onClick={handleAnnotateProjectClick}
          >
            Annotate Project
          </Button>
          <Button variant="outlined" color="error">
            Delete Project
          </Button>
        </Box>
      </Box>
    );
  };
  return (
    <>
      <Box mt={4} mb={10}>
        <Typography variant="h4" component="h1">
          {projectName}
        </Typography>
        <Divider sx={{ my: 1, borderWidth: 2, borderColor: "text.primary" }} />
        {renderProject()}
      </Box>
    </>
  );
};
export default annotationProjectDetail;