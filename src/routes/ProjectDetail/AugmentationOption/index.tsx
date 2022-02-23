import { Box, CircularProgress, Typography } from "@mui/material";
import { InfoTooltip, MyButton } from "components";
import {
  ID_TOKEN_NAME,
  MAX_AUGMENT_FREE_PLAN,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  AUGMENT_GENERATE_IMAGES_TYPE,
} from "constants/defaultValues";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectorIsAlbumSelectMode } from "reduxes/album/selector";
import {
  selectorCurrentProjectIdDownloading,
  selectorIsDownloading,
} from "reduxes/download/selector";
import { generateImages } from "reduxes/generate/action";
import {
  selectorIsGenerateImagesAugmenting,
  selectorIsGenerateImagesPreprocessing,
} from "reduxes/generate/selector";
import {
  selectorCurrentProjectAugmentedTimes,
  selectorCurrentProjectId,
  selectorCurrentProjectName,
  selectorCurrentProjectOriginalSplitDataNumber,
  selectorCurrentProjectPreprocessSplitDataNumber,
  selectorCurrentProjectTotalOriginalImage,
  selectorCurrentProjectTotalPreprocessImage,
  selectorHaveTaskRunning,
  selectorIsEditingSplitData,
  selectorIsFetchingDetailProject,
  selectorMethodList,
  selectorSelectedDataSource,
} from "reduxes/project/selector";
import { MethodInfoFields } from "reduxes/project/type";
import { selectorIsUploading } from "reduxes/upload/selector";
import { getLocalStorage } from "utils/general";
import { AugmentationOptionProps } from "./type";

const AugmentationOption = function (props: AugmentationOptionProps) {
  const dispatch = useDispatch();
  const projectId = useSelector(selectorCurrentProjectId);
  const projectName = useSelector(selectorCurrentProjectName);

  const listMethod = useSelector(selectorMethodList);

  const originalSplitDataNumber = useSelector(
    selectorCurrentProjectOriginalSplitDataNumber
  );

  const preprocessSplitDataNumber = useSelector(
    selectorCurrentProjectPreprocessSplitDataNumber
  );

  const totalOriginalImages = useSelector(
    selectorCurrentProjectTotalOriginalImage
  );

  const totalPreprocessImages = useSelector(
    selectorCurrentProjectTotalPreprocessImage
  );

  const selectedDataSource = useSelector(selectorSelectedDataSource);

  const isGenerateImagesAugmenting = useSelector(
    selectorIsGenerateImagesAugmenting
  );

  const isGenerateImagesPreprocessing = useSelector(
    selectorIsGenerateImagesPreprocessing
  );

  const isAlbumSelectMode = useSelector(selectorIsAlbumSelectMode);

  const generateTimes = useSelector(selectorCurrentProjectAugmentedTimes);
  const isFetchingDetailProject = useSelector(selectorIsFetchingDetailProject);
  const haveTaskRunning = useSelector(selectorHaveTaskRunning);

  const isUploading = useSelector(selectorIsUploading);

  const isEditingSplitData = useSelector(selectorIsEditingSplitData);

  const isDownloading = useSelector(selectorIsDownloading);
  const currentProjectIdDownloading = useSelector(
    selectorCurrentProjectIdDownloading
  );

  const splitDataNumberBySource = useMemo(() => {
    if (selectedDataSource === ORIGINAL_SOURCE) {
      return originalSplitDataNumber;
    }

    if (selectedDataSource === PREPROCESS_SOURCE) {
      return preprocessSplitDataNumber;
    }

    return [0, 0, 0];
  }, [selectedDataSource, originalSplitDataNumber, preprocessSplitDataNumber]);

  const isAllowRunAugmentation = useMemo(() => {
    if (haveTaskRunning) {
      return false;
    }

    if (selectedDataSource === ORIGINAL_SOURCE) {
      if (originalSplitDataNumber && totalOriginalImages > 0) {
        return true;
      }

      return false;
    }

    if (selectedDataSource === PREPROCESS_SOURCE) {
      if (preprocessSplitDataNumber && totalPreprocessImages > 0) {
        return true;
      }

      return false;
    }

    return false;
  }, [
    haveTaskRunning,
    selectedDataSource,
    totalOriginalImages,
    totalPreprocessImages,
    originalSplitDataNumber,
    preprocessSplitDataNumber,
  ]);

  const onClickRunAugmentation = () => {
    if (isEditingSplitData) {
      return toast.error(
        "Please confirm Training/Validation/Test split data before run augmentation."
      );
    }

    if (splitDataNumberBySource && splitDataNumberBySource[0] === 0) {
      return toast.error("The number of training image must be greater than 0");
    }

    if (listMethod && splitDataNumberBySource) {
      dispatch(
        generateImages({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          projectId,
          projectName,
          listMethodId: listMethod.augmentation.map(
            (method: MethodInfoFields) => method.method_id
          ),
          dataType: selectedDataSource,
          numberImageGeneratePerSource: 1,
          dataNumber: splitDataNumberBySource,
          generateMethod: AUGMENT_GENERATE_IMAGES_TYPE,
        })
      );
    }

    return null;
  };

  const renderContent = () => {
    if (isFetchingDetailProject === null || isFetchingDetailProject === true) {
      return (
        <Box my={3} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      );
    }

    return (
      <Box>
        <Typography sx={{ mt: 2 }} variant="body2">
          Number of Augmentation Runs: {generateTimes}/{MAX_AUGMENT_FREE_PLAN}
        </Typography>
      </Box>
    );
  };

  const renderMethodList = () => {
    if (listMethod && listMethod.augmentation) {
      return (
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }} variant="body2">
            Methods:
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
            {listMethod?.augmentation.map((augmentationMethod) => (
              <Box
                flexBasis="33.33%"
                key={`augmentation-method-${augmentationMethod.method_id}`}
              >
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  variant="caption"
                  color="text.secondary"
                >
                  {augmentationMethod.method_name
                    .replace(/_/g, " ")
                    .replace(/random/g, "")}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            sx={{ mt: 2, mb: 1 }}
            variant="caption"
            component="p"
            fontStyle="italic"
            color="text.secondary"
          >
            * We will randomly apply the above methods to the dataset.
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography fontWeight={500}>Augmentation Option</Typography>
          <InfoTooltip
            sx={{ ml: 1 }}
            title="Data source: Augmentation is only applied to the training dataset based on the data source you previously selected. For each augmentation run, you can define a new data source and a training/validation/test split."
          />
        </Box>
        <MyButton
          color="primary"
          variant="contained"
          size="small"
          isLoading={!!isGenerateImagesAugmenting}
          disabled={
            !isAllowRunAugmentation ||
            isFetchingDetailProject === null ||
            isFetchingDetailProject === true ||
            isUploading ||
            isAlbumSelectMode ||
            !!isGenerateImagesPreprocessing ||
            (!!isDownloading && projectId === currentProjectIdDownloading)
          }
          onClick={onClickRunAugmentation}
        >
          Run
        </MyButton>
      </Box>
      {renderContent()}
      {renderMethodList()}
    </Box>
  );
};

export default AugmentationOption;
