import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Modal,
  Typography,
} from "@mui/material";

import { modalCloseStyle, modalStyle } from "styles/generalStyle";

import { useEffect, useMemo, useState } from "react";
import annotationProjectApi, {
  CheckSegmentationProgressDataFields,
} from "services/annotationProjectApi";
import { useSelector } from "react-redux";
import { selectorAnnotationCurrentProject } from "reduxes/annotationProject/selector";
import { SegmentationProgressModalProps } from "./type";

function SegmentationProgressModal({
  isOpen,
  onClose,
}: SegmentationProgressModalProps) {
  const [
    isFetchingCheckSegmentationProgress,
    setIsFetchingCheckSegmentationProgress,
  ] = useState<boolean | null>(null);

  const [progressData, setProgressData] = useState<
    CheckSegmentationProgressDataFields | undefined
  >();

  const annotationCurrentProject = useSelector(
    selectorAnnotationCurrentProject
  );

  const currentProjectId = useMemo(
    () =>
      (annotationCurrentProject && annotationCurrentProject?.project_id) ||
      null,
    [annotationCurrentProject]
  );

  const resetProgressData = () => {
    setProgressData(undefined);
  };

  const onCloseModal = () => {
    resetProgressData();
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && currentProjectId) {
      setIsFetchingCheckSegmentationProgress(true);
      annotationProjectApi
        .checkSegmentationProgress({
          projectId: currentProjectId,
        })
        .then((checkSegmentationProgressResponse) => {
          setIsFetchingCheckSegmentationProgress(false);
          if (
            checkSegmentationProgressResponse &&
            checkSegmentationProgressResponse.data
          ) {
            setProgressData(
              checkSegmentationProgressResponse.data as CheckSegmentationProgressDataFields
            );
          }
        });
    }
  }, [isOpen]);

  const renderProgressContent = () => {
    if (progressData) {
      const { total, finished } = progressData;

      return (
        <Box width="100%" textAlign="center">
          <LinearProgress
            value={Math.ceil((finished * 100) / total)}
            variant="determinate"
          />
          <Typography mt={1}>
            {finished}/{total} images
          </Typography>
        </Box>
      );
    }

    if (isFetchingCheckSegmentationProgress === false) {
      return (
        <Box>
          <Typography mt={1} fontStyle="italic" color="text.secondary">
            No data yet.
          </Typography>
        </Box>
      );
    }

    return null;
  };

  if (currentProjectId) {
    return (
      <Modal
        open={isOpen}
        onClose={
          !isFetchingCheckSegmentationProgress ? onCloseModal : undefined
        }
        disableEscapeKeyDown
      >
        <Box sx={{ ...modalStyle, width: 700 }}>
          <IconButton
            sx={modalCloseStyle}
            onClick={
              !isFetchingCheckSegmentationProgress ? onCloseModal : undefined
            }
          >
            <CancelIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4" component="h2">
            Segmentation Progress
          </Typography>
          <Box mt={6}>
            <Box display="flex" justifyContent="center">
              {isFetchingCheckSegmentationProgress !== false ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <CircularProgress />
                  <Typography mt={1} variant="caption" color="text.secondary">
                    Fetching segmentation progress infomation...
                  </Typography>
                </Box>
              ) : (
                renderProgressContent()
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
  return null;
}

export default SegmentationProgressModal;
