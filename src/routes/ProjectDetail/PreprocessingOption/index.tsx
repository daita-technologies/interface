import { Box, Switch, Typography } from "@mui/material";
import { InfoTooltip, MyButton } from "components";
import {
  ID_TOKEN_NAME,
  ORIGINAL_SOURCE,
  PREPROCESSING_GENERATE_IMAGES_TYPE,
  PREPROCESS_SOURCE,
} from "constants/defaultValues";
import { useDispatch, useSelector } from "react-redux";
import { selectorIsAlbumSelectMode } from "reduxes/album/selector";
import { changePreprocessingExpertMode } from "reduxes/customPreprocessing/action";
import {
  selectorIsPreprocessingExpertMode,
  selectorReferencePreprocessImage,
} from "reduxes/customPreprocessing/selector";
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
  selectorCurrentProjectId,
  selectorCurrentProjectName,
  selectorCurrentProjectTotalOriginalImage,
  selectorHaveTaskRunning,
  selectorMethodList,
} from "reduxes/project/selector";
import { selectorIsUploading } from "reduxes/upload/selector";
import { getLocalStorage } from "utils/general";
import ExpertPreprocessingOption from "./ExpertPreprocessOption";
import { PreprocessingOptionProps } from "./type";

const PreprocessingOption = function (props: PreprocessingOptionProps) {
  const dispatch = useDispatch();
  const projectId = useSelector(selectorCurrentProjectId);
  const projectName = useSelector(selectorCurrentProjectName);

  const listMethod = useSelector(selectorMethodList);

  const totalOriginalImages = useSelector(
    selectorCurrentProjectTotalOriginalImage
  );

  const isGenerateImagesPreprocessing = useSelector(
    selectorIsGenerateImagesPreprocessing
  );

  const isGenerateImagesAugmenting = useSelector(
    selectorIsGenerateImagesAugmenting
  );

  const haveTaskRunning = useSelector(selectorHaveTaskRunning);

  const isUploading = useSelector(selectorIsUploading);

  const isAlbumSelectMode = useSelector(selectorIsAlbumSelectMode);

  const isDownloading = useSelector(selectorIsDownloading);
  const currentProjectIdDownloading = useSelector(
    selectorCurrentProjectIdDownloading
  );
  const isPreprocessingExpertMode = useSelector(
    selectorIsPreprocessingExpertMode
  );
  const referencePreprocessImage = useSelector(
    selectorReferencePreprocessImage
  );
  const handleChangePreprocessintExpertMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      changePreprocessingExpertMode({
        isPreprocessingExpertMode: event.target.checked,
      })
    );
  };
  const onClickRunPreprocessing = () => {
    let listMethodId = [] as string[];
    const referenceImages = {} as Record<string, string>;
    if (isPreprocessingExpertMode) {
      listMethodId = Object.keys(referencePreprocessImage);
      listMethodId.forEach((methodId) => {
        referenceImages[methodId] =
          referencePreprocessImage[methodId].imageS3Path;
      });
    }
    dispatch(
      generateImages({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId,
        projectName,
        listMethodId,
        processType: PREPROCESS_SOURCE,
        referenceImages,
        dataType: ORIGINAL_SOURCE,
        numberImageGeneratePerSource: 1,
        dataNumber: [totalOriginalImages, 0, 0],
        generateMethod: PREPROCESSING_GENERATE_IMAGES_TYPE,
      })
    );
  };

  const renderMethodList = () => {
    if (listMethod && listMethod.preprocessing) {
      return (
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography fontWeight={500}>Preprocessing Option </Typography>

              <InfoTooltip
                sx={{ ml: 1 }}
                title="Data source: Preprocessing is applied to the original dataset."
              />
            </Box>
          </Box>
          <Typography sx={{ mt: 2, mb: 1 }} variant="body2">
            Methods:
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
            {listMethod?.preprocessing.map((preprocessMethod) => (
              <Box
                flexBasis="33.33%"
                key={`preprocessing-method-${preprocessMethod.method_id}`}
              >
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  variant="caption"
                  color="text.secondary"
                >
                  {preprocessMethod.method_name.replace(/_/g, " ")}
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
    <Box display="flex" flexDirection="column" flex={1}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            All preprocessing methods are applied to the original dataset
          </Typography>
          <Typography variant="h6" fontWeight={400}>
            Select your mode
          </Typography>
        </Box>
        <Box>
          <MyButton
            color="primary"
            variant="contained"
            size="small"
            isLoading={!!isGenerateImagesPreprocessing}
            disabled={
              totalOriginalImages <= 0 ||
              haveTaskRunning ||
              isUploading ||
              isAlbumSelectMode ||
              !!isGenerateImagesAugmenting ||
              (!!isDownloading && projectId === currentProjectIdDownloading)
            }
            onClick={onClickRunPreprocessing}
          >
            Run
          </MyButton>
        </Box>
      </Box>

      <Box
        sx={{ mt: 1, mb: 2 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Switch
            checked={isPreprocessingExpertMode}
            size="small"
            onChange={handleChangePreprocessintExpertMode}
          />
          <Typography fontWeight={500}>Expert Mode</Typography>
          <InfoTooltip sx={{ ml: 1 }} title="Expert mode" />
        </Box>
      </Box>

      {isPreprocessingExpertMode ? (
        <ExpertPreprocessingOption />
      ) : (
        renderMethodList()
      )}
    </Box>
  );
};

export default PreprocessingOption;
