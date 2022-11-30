import { LoadingButton } from "@mui/lab";
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  fetchDetailAnnotationProjects,
  fetchListAnnotationProjects,
  setCurrentAnnotationProject,
  setIsOpenDeleteProject,
} from "reduxes/annotationProject/action";
import {
  selectorAnnotationCurrentProject,
  selectorIsFetchingDetailAnnotationProject,
} from "reduxes/annotationProject/selector";
import { formatBytes, getLocalStorage, separateNumber } from "utils/general";
import SegmentationProgressModal from "./SegmentationProgressModal";
import UploadAnnotationImage from "./UploadAnnotationImage";

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

  const [
    isOpenCheckSegmentationProgressModal,
    setIsOpenCheckSegmentationProgressModal,
  ] = useState(false);

  const onCloseCheckSegmentationProgressModal = () => {
    setIsOpenCheckSegmentationProgressModal(false);
  };

  const onOpenCheckSegmentationProgressModal = () => {
    setIsOpenCheckSegmentationProgressModal(true);
  };

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
  }, [projectName]);

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
    if (!annotationCurrentProject) {
      return null;
    }
    let totalOriginalImage = 0;
    let totalPreprocessImage = 0;
    const totalAugmentImage = 0;

    let totalOriginalSize = 0;
    let totalPreprocessSize = 0;
    const totalAugmentSize = 0;
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
      <Box display="flex" flexDirection="column" width="100%">
        <Box
          display="flex"
          mt={2}
          p={2}
          bgcolor="background.paper"
          borderRadius={2}
        >
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
            <Typography fontSize={14}>
              {formatBytes(totalAugmentSize)}
            </Typography>
            <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
            <Typography fontSize={18} fontWeight="bold">
              {formatBytes(
                totalOriginalSize + totalPreprocessSize + totalAugmentSize
              )}
            </Typography>
          </Box>
        </Box>
        <Box>
          <UploadAnnotationImage
            projectId={annotationCurrentProject.project_id}
            projectName={annotationCurrentProject.project_name}
          />
        </Box>
      </Box>
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
    window.open(`/${ANNOTATION_EDITOR_ROUTE_NAME}/${projectName}`, "_blank");
  };

  const onClickGoToProjectDashboard = () => {
    history.push("/annotation/projects");
  };

  const handleClickDeleteProject = () => {
    if (annotationCurrentProject) {
      dispatch(
        setIsOpenDeleteProject({
          isOpen: true,
          projectId: annotationCurrentProject.project_id,
          projectName: annotationCurrentProject.project_name,
        })
      );
    }
  };

  const renderProject = () => {
    if (
      isFetchingDetailAnnotationProject === null ||
      isFetchingDetailAnnotationProject === true
    ) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flex={1}
          py={6}
        >
          <CircularProgress size={20} />
          <Typography
            mt={1}
            color="text.secondary"
            variant="body2"
            fontStyle="italic"
          >
            Fetching project information...
          </Typography>
        </Box>
      );
    }

    if (annotationCurrentProject) {
      if (
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

      return (
        <Box>
          <Box mt={2} p={2} display="flex" borderRadius={2} flex={1}>
            {renderContent()}
          </Box>
          <Box mt={1} px={2}>
            <Button
              variant="outlined"
              onClick={onOpenCheckSegmentationProgressModal}
            >
              Check Segmentation Progress
            </Button>
          </Box>
          <Box mt={10} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="success"
              onClick={handleAnnotateProjectClick}
            >
              Annotate Project
            </Button>
            <LoadingButton
              variant="outlined"
              color="error"
              onClick={handleClickDeleteProject}
            >
              Delete Project
            </LoadingButton>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        mt={14}
        mb={10}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography mb={2}>Project does not exist.</Typography>
        <Button variant="outlined" onClick={onClickGoToProjectDashboard}>
          Go to Project Dashboard
        </Button>
      </Box>
    );
  };

  return (
    <Box mt={4} mb={10}>
      <Typography variant="h4" component="h1">
        {projectName}
      </Typography>
      <Divider sx={{ my: 1, borderWidth: 2, borderColor: "text.primary" }} />
      {renderProject()}
      <SegmentationProgressModal
        isOpen={isOpenCheckSegmentationProgressModal}
        onClose={onCloseCheckSegmentationProgressModal}
      />
    </Box>
  );
};
export default annotationProjectDetail;
