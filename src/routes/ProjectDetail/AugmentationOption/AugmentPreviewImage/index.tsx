import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { MyButton, Empty } from "components";
import { SUPER_RESOLUTION_ID } from "components/ImageProcessing/type";
import {
  AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE,
  AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE,
  ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH,
} from "constants/customMethod";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import {
  changeAugmentCustomMethodParamValue,
  getAugmentCustomMethodPreviewImageInfo,
  setReferenceSeletectorDialog,
} from "reduxes/customAugmentation/action";
import {
  selectorAugmentCustomMethodPreviewImageInfo,
  selectorIsFetchingAugmentCustomMethodPreviewImage,
  selectorAugmentCustomMethodDialog,
  selectorSpecificSavedAugmentCustomMethodParamValue,
} from "reduxes/customAugmentation/selector";
import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

import {
  selectorCurrentProjectId,
  selectorMethodList,
} from "reduxes/project/selector";

import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { prettyMethodName } from "../../PreprocessingOption/ReferenceImageDialog";
import SamplePreviewImageElement from "../SamplePreviewImageElement";
import ParamControl from "./ParamControl";
import PreviewImage from "./PreviewImage";

const AugmentPreviewImageDialog = function () {
  const dispatch = useDispatch();
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const methods = useSelector(selectorMethodList)?.augmentation;

  const { isShow, methodId } = useSelector(selectorAugmentCustomMethodDialog);

  const isFetchingAugmentCustomMethodPreviewImage = useSelector(
    selectorIsFetchingAugmentCustomMethodPreviewImage
  );

  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );

  const specificSavedAugmentCustomMethodParamValue = useSelector(
    (state: RootState) =>
      selectorSpecificSavedAugmentCustomMethodParamValue(
        currentProjectId,
        methodId || "",
        state
      )
  );

  const [
    localSpecificSavedAugmentCustomMethodParamValue,
    setLocalSpecificSavedAugmentCustomMethodParamValue,
  ] = useState<AugmentCustomMethodParamValue>();

  useEffect(() => {
    if (isShow) {
      if (specificSavedAugmentCustomMethodParamValue) {
        setLocalSpecificSavedAugmentCustomMethodParamValue(
          specificSavedAugmentCustomMethodParamValue
        );
      }
    }
  }, [isShow, specificSavedAugmentCustomMethodParamValue]);

  const handleClose = (event: any, reason?: string) => {
    if (reason && reason === "backdropClick") return;
    setLocalSpecificSavedAugmentCustomMethodParamValue(undefined);
    dispatch(setReferenceSeletectorDialog({ isShow: false }));
  };

  useEffect(() => {
    if (methodId) {
      if (!augmentCustomMethodPreviewImageInfo) {
        dispatch(getAugmentCustomMethodPreviewImageInfo({ methodId }));
      }
    }
  }, [methodId]);

  const handleClickApply = () => {
    if (localSpecificSavedAugmentCustomMethodParamValue) {
      dispatch(
        changeAugmentCustomMethodParamValue({
          projectId: currentProjectId,
          ...localSpecificSavedAugmentCustomMethodParamValue,
        })
      );
      handleClose(null);
    }
  };

  const renderCompareImage = () => {
    if (augmentCustomMethodPreviewImageInfo) {
      const { ls_params_name } = augmentCustomMethodPreviewImageInfo;
      if (methodId) {
        return (
          <Box>
            <Box mb={2}>
              <PreviewImage
                methodId={methodId}
                localSpecificSavedAugmentCustomMethodParamValue={
                  localSpecificSavedAugmentCustomMethodParamValue
                }
                setLocalSpecificSavedAugmentCustomMethodParamValue={
                  setLocalSpecificSavedAugmentCustomMethodParamValue
                }
              />
            </Box>

            {ls_params_name.map((paramName: string, paramNameIndex: number) => (
              <Box
                key={`param-control-wrapper-${paramName}`}
                mb={paramNameIndex === ls_params_name.length - 1 ? 2 : 0}
              >
                <ParamControl
                  key={`param-control-${paramName}`}
                  methodId={methodId}
                  paramName={paramName}
                  localSpecificSavedAugmentCustomMethodParamValue={
                    localSpecificSavedAugmentCustomMethodParamValue
                  }
                  setLocalSpecificSavedAugmentCustomMethodParamValue={
                    setLocalSpecificSavedAugmentCustomMethodParamValue
                  }
                />
              </Box>
            ))}
          </Box>
        );
      }
    }

    return (
      <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
        <Empty description="No data for this method yet." />
      </Box>
    );
  };

  const getMethodName = (id: string | undefined) => {
    if (methodId) {
      return methods?.find((t) => t.method_id === id)?.method_name;
    }
    return "";
  };

  const renderAugmentCustomMethodContent = () => {
    if (isFetchingAugmentCustomMethodPreviewImage) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" my={16}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Box marginTop={3} height="70%">
          <Box display="flex" justifyContent="space-between" height="90%">
            <Box mt={3} flex={2} width="100%" height="100%">
              <SamplePreviewImageElement
                isOriginalSampleImage
                isShowResolution={methodId === SUPER_RESOLUTION_ID}
                src={ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH}
                width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
                height={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
                alt="original"
              />
            </Box>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ backgroundColor: "text.secondary", margin: 2 }}
            />
            <Box mt={3} flex={2} width="100%" height="100%">
              {renderCompareImage()}
            </Box>
          </Box>
        </Box>

        {augmentCustomMethodPreviewImageInfo && (
          <Box display="flex" justifyContent="flex-end" marginTop={4}>
            <MyButton
              type="button"
              variant="contained"
              color="primary"
              onClick={handleClickApply}
            >
              Apply
            </MyButton>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Modal open={isShow} onClose={handleClose} disableEscapeKeyDown>
      <Box sx={{ ...modalStyle, width: 800, minHeight: 500 }}>
        <IconButton sx={modalCloseStyle} onClick={(e) => handleClose(e, "")}>
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          {prettyMethodName(getMethodName(methodId))}
        </Typography>
        {renderAugmentCustomMethodContent()}
      </Box>
    </Modal>
  );
};

export default AugmentPreviewImageDialog;
