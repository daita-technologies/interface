import { Box, Typography } from "@mui/material";
import { MyButton } from "components";
import {
  AUGMENT_GENERATE_IMAGES_TYPE,
  AUGMENT_SOURCE,
  DEFAULT_SPLIT_DATASET_PERCENT_RATE,
  ID_TOKEN_NAME,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
} from "constants/defaultValues";
import useConfirmDialog from "hooks/useConfirmDialog";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "reduxes";
import { selectorIsAlbumSelectMode } from "reduxes/album/selector";
import { selectorSavedAugmentCustomMethodParamValue } from "reduxes/customAugmentation/selector";
import {
  selectorCurrentProjectIdDownloading,
  selectorIsDownloading,
} from "reduxes/download/selector";
import { generateImages } from "reduxes/generate/action";
import {
  selectorIsGenerateImagesAugmenting,
  selectorIsGenerateImagesPreprocessing,
} from "reduxes/generate/selector";
import { AugmentParameterApiField } from "reduxes/generate/type";
import { setSplitDataNumber } from "reduxes/project/action";
import {
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
import { selectorIsUploading } from "reduxes/upload/selector";
import { getLocalStorage } from "utils/general";
import { RunAugmentButtonProps } from "./type";

const RunAugmentButton = function ({ isExpertMode }: RunAugmentButtonProps) {
  const dispatch = useDispatch();

  const projectId = useSelector(selectorCurrentProjectId);
  const projectName = useSelector(selectorCurrentProjectName);

  const isFetchingDetailProject = useSelector(selectorIsFetchingDetailProject);

  const isGenerateImagesAugmenting = useSelector(
    selectorIsGenerateImagesAugmenting
  );
  const haveTaskRunning = useSelector(selectorHaveTaskRunning);
  const isUploading = useSelector(selectorIsUploading);
  const isAlbumSelectMode = useSelector(selectorIsAlbumSelectMode);
  const isGenerateImagesPreprocessing = useSelector(
    selectorIsGenerateImagesPreprocessing
  );

  const isDownloading = useSelector(selectorIsDownloading);
  const currentProjectIdDownloading = useSelector(
    selectorCurrentProjectIdDownloading
  );

  const isAllowRunAugmentation = useMemo(() => {
    if (haveTaskRunning) {
      return false;
    }

    return true;
  }, [haveTaskRunning]);

  const selectedDataSource = useSelector(selectorSelectedDataSource);
  const isEditingSplitData = useSelector(selectorIsEditingSplitData);
  const originalSplitDataNumber = useSelector(
    selectorCurrentProjectOriginalSplitDataNumber
  );

  const preprocessSplitDataNumber = useSelector(
    selectorCurrentProjectPreprocessSplitDataNumber
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

  const totalPreprocessImages = useSelector(
    selectorCurrentProjectTotalPreprocessImage
  );

  const totalOriginalImages = useSelector(
    selectorCurrentProjectTotalOriginalImage
  );

  const listMethod = useSelector(selectorMethodList);

  const generateDefaultSplitDataset = () => {
    let trainingValue = 0;
    let validationValue = 0;
    let testValue = 0;

    if (selectedDataSource === ORIGINAL_SOURCE) {
      testValue = Math.floor(
        (totalOriginalImages * DEFAULT_SPLIT_DATASET_PERCENT_RATE[2]) / 100
      );
      validationValue = Math.floor(
        (totalOriginalImages * DEFAULT_SPLIT_DATASET_PERCENT_RATE[1]) / 100
      );
      trainingValue = totalOriginalImages - testValue - validationValue;
    } else if (selectedDataSource === PREPROCESS_SOURCE) {
      testValue = Math.floor(
        (totalPreprocessImages * DEFAULT_SPLIT_DATASET_PERCENT_RATE[2]) / 100
      );
      validationValue = Math.floor(
        (totalPreprocessImages * DEFAULT_SPLIT_DATASET_PERCENT_RATE[1]) / 100
      );
      trainingValue = totalPreprocessImages - testValue - validationValue;
    }

    return [trainingValue, validationValue, testValue];
  };

  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const savedAugmentCustomMethodParamValue = useSelector((state: RootState) =>
    selectorSavedAugmentCustomMethodParamValue(projectId, state)
  );

  const callRunAugmentation = (splitDataNumber: number[]) => {
    const userCustomAugmentParameters: AugmentParameterApiField = {};
    const listSelectedMethodId: string[] = [];

    Object.keys(savedAugmentCustomMethodParamValue).forEach((methodId) => {
      if (savedAugmentCustomMethodParamValue[methodId]) {
        listSelectedMethodId.push(methodId);
        const savedSpecificMethod =
          savedAugmentCustomMethodParamValue[methodId];
        if (savedSpecificMethod) {
          savedSpecificMethod.params.forEach((paramObject) => {
            userCustomAugmentParameters[methodId] = {
              ...userCustomAugmentParameters[methodId],
              [paramObject.paramName]: paramObject.paramValue,
            };
          });
        }
      }
    });

    dispatch(
      generateImages({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId,
        projectName,
        listMethodId: isExpertMode ? listSelectedMethodId : [],
        processType: AUGMENT_SOURCE,
        referenceImages: {},
        dataType: selectedDataSource,
        numberImageGeneratePerSource: 1,
        dataNumber: splitDataNumber,
        generateMethod: AUGMENT_GENERATE_IMAGES_TYPE,
        augmentParameters: isExpertMode ? userCustomAugmentParameters : {},
      })
    );
  };

  const runOpenConfirmDialog = () => {
    const defaultSplitDataset = generateDefaultSplitDataset();

    const typeProcessRun =
      selectedDataSource === PREPROCESS_SOURCE ? "preprocessed" : "original";

    openConfirmDialog({
      content: (
        <Box lineHeight={1.5}>
          <Typography sx={{ mb: 2 }} fontWeight={700}>
            Have you already configured the split of the training, validation
            and test datasets?
          </Typography>
          If you do not customise the split, the default configuration of{" "}
          <Typography component="span" fontWeight={700}>
            70% (training), 20% (validation), 10% (test)
          </Typography>{" "}
          is applied, using the {typeProcessRun} dataset as a basis.
        </Box>
      ),
      negativeText: "Cancel",
      positiveText: "Proceed",
      onClickNegative: closeConfirmDialog,
      onClickPositive: () => {
        if (listMethod) {
          dispatch(
            setSplitDataNumber({
              typeMethod: selectedDataSource,
              splitDataNumber: defaultSplitDataset,
            })
          );
          callRunAugmentation(defaultSplitDataset);
          closeConfirmDialog();
        }
      },
    });
  };

  const onClickRunAugmentation = () => {
    if (isEditingSplitData) {
      return toast.error(
        "Please confirm Training/Validation/Test split data before run augmentation."
      );
    }

    if (splitDataNumberBySource && splitDataNumberBySource[0] === 0) {
      return toast.error("The number of training image must be greater than 0");
    }

    if (selectedDataSource === PREPROCESS_SOURCE) {
      if (totalPreprocessImages <= 0) {
        return toast.error(
          "Generate preprocessed images before run augmentation."
        );
      }
    } else if (selectedDataSource === ORIGINAL_SOURCE) {
      if (totalOriginalImages <= 0) {
        return toast.error("Upload original images before run augmentation.");
      }
    }

    if (listMethod) {
      if (splitDataNumberBySource) {
        callRunAugmentation(splitDataNumberBySource);
      } else {
        runOpenConfirmDialog();
      }
    }

    return null;
  };

  return (
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
  );
};

export default RunAugmentButton;
