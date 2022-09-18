import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { modalCloseStyle, modalStyle } from "styles/generalStyle";

import lodash from "lodash";
import { AUGMENT_SOURCE, PREPROCESS_SOURCE } from "constants/defaultValues";
import { ImageApiFields } from "reduxes/album/type";
import { ListMethodType, MethodInfoFields } from "reduxes/project/type";

import { formatBytes, objectIndexOf } from "utils/general";
import {
  selectorCurrentProjectId,
  selectorMethodList,
} from "reduxes/project/selector";
import { loadImageContent } from "reduxes/album/action";
import { S3_BUCKET_NAME } from "constants/s3Values";

import { PreviewImageModalProps } from "./type";

const convertMethodCodeToName = (
  image: ImageApiFields | null,
  listMethod: ListMethodType | null
) => {
  if (image && image.gen_id) {
    let usingListMethod: Array<MethodInfoFields> = [];
    if (image.typeOfImage === PREPROCESS_SOURCE) {
      usingListMethod = listMethod?.preprocessing || [];
    } else if (image.typeOfImage === AUGMENT_SOURCE) {
      usingListMethod = listMethod?.augmentation || [];
    }

    if (usingListMethod) {
      let genIdArray = [];

      if (typeof image.gen_id === "string") {
        try {
          genIdArray = JSON.parse(image.gen_id.replace(/'/g, '"'));
        } catch {
          //
        }
      } else {
        genIdArray = image.gen_id || [];
      }

      return genIdArray.map((methodCode: string) => {
        if (usingListMethod) {
          const matchMethodIndex = objectIndexOf(
            usingListMethod,
            methodCode,
            "method_id"
          );
          if (matchMethodIndex > -1) {
            if (image.typeOfImage === PREPROCESS_SOURCE) {
              return lodash.startCase(
                usingListMethod[matchMethodIndex].method_name.replace(/_/g, " ")
              );
            }

            if (image.typeOfImage === AUGMENT_SOURCE) {
              return lodash.startCase(
                usingListMethod[matchMethodIndex].method_name
                  .replace(/_/g, " ")
                  .replace(/random/g, "")
              );
            }

            return "";
          }

          return "";
        }
        return "";
      });
    }
  }

  return [];
};

function PreviewImageModal({
  images,
  imagesFileNameArray,
  previewImage,
  setPreviewImage,
}: PreviewImageModalProps) {
  const listMethod = useSelector(selectorMethodList);
  const dispatch = useDispatch();

  const currentProjectId = useSelector(selectorCurrentProjectId);

  const onViewPreviousImages = (currentImageFileName: string) => {
    if (currentImageFileName) {
      const currentPreviewIamgeIndex =
        imagesFileNameArray.indexOf(currentImageFileName);

      if (currentPreviewIamgeIndex > -1) {
        if (currentPreviewIamgeIndex + 1 > 1) {
          setPreviewImage(
            images[imagesFileNameArray[currentPreviewIamgeIndex - 1]]
          );
        }
      }
    }
  };

  const onViewNextImages = (currentImageFileName: string) => {
    if (currentImageFileName) {
      const currentPreviewIamgeIndex =
        imagesFileNameArray.indexOf(currentImageFileName);

      if (currentPreviewIamgeIndex > -1) {
        if (currentPreviewIamgeIndex + 1 < imagesFileNameArray.length) {
          setPreviewImage(
            images[imagesFileNameArray[currentPreviewIamgeIndex + 1]]
          );
        }
      }
    }
  };

  useEffect(() => {
    const handleNavigateWhenPressArrow = (event: KeyboardEvent) => {
      if (previewImage) {
        if (event.key === "ArrowRight") {
          onViewNextImages(previewImage?.filename!);
        } else if (event.key === "ArrowLeft") {
          onViewPreviousImages(previewImage?.filename!);
        }
      }
    };

    document.addEventListener("keydown", handleNavigateWhenPressArrow);

    return () => {
      document.removeEventListener("keydown", handleNavigateWhenPressArrow);
    };
  }, [previewImage]);

  const methodListString = convertMethodCodeToName(
    previewImage,
    listMethod
  ).join(", ");

  useEffect(() => {
    if (previewImage) {
      dispatch(
        loadImageContent({
          fileName: previewImage.filename,
          projectId: currentProjectId,
          typeMethod: previewImage.typeOfImage,
          photoKey: previewImage.s3_key.replace(`${S3_BUCKET_NAME}/`, ""),
          isFetchToDownload: false,
          isThumbnailImage: false,
        })
      );
    }
  }, [previewImage]);

  return (
    <Modal open={!!previewImage} onClose={() => setPreviewImage(null)}>
      <Box sx={modalStyle} bgcolor="background.paper">
        <IconButton sx={modalCloseStyle} onClick={() => setPreviewImage(null)}>
          <CancelIcon fontSize="large" />
        </IconButton>
        <Box>
          <Typography sx={{ marginBottom: 1 }} variant="h5" component="p">
            Preview Image
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <IconButton
                sx={{ "&:disabled": { opacity: 0.2 } }}
                disabled={
                  imagesFileNameArray.indexOf(previewImage?.filename!) === 0
                }
                onClick={() => onViewPreviousImages(previewImage?.filename!)}
              >
                <ArrowBackIcon fontSize="large" />
              </IconButton>
            </Box>
            <Box>
              {previewImage ? (
                <Card
                  sx={{
                    width: "80vw",
                    height: "80vh",
                    maxHeight: "80vh",
                    maxWidth: "80vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "none",
                  }}
                >
                  {images[previewImage.filename].url ? (
                    <CardMedia
                      sx={{
                        objectFit: "contain",
                        width: "60vw",
                        height: "60vh",
                        maxHeight: "60vh",
                        maxWidth: "60vw",
                      }}
                      component="img"
                      src={images[previewImage.filename].url}
                      alt="ts"
                    />
                  ) : (
                    <Box sx={{ position: "relative" }}>
                      <Skeleton
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 999,
                        }}
                        variant="rectangular"
                        width="100%"
                        height="100%"
                      />
                      <Box
                        sx={{
                          backgroundImage: `url(${previewImage.thumbnailUrl})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          width: "60vw",
                          height: "60vh",
                          maxHeight: "60vh",
                          maxWidth: "60vw",
                          opacity: 0.3,
                        }}
                      />
                    </Box>
                  )}

                  <CardContent>
                    <Typography variant="body2">
                      Name:{" "}
                      <Typography
                        fontWeight="bold"
                        component="span"
                        variant="body2"
                      >
                        {previewImage.filename}
                      </Typography>
                    </Typography>
                    <Typography variant="body2">
                      Size:{" "}
                      {images[previewImage.filename].url
                        ? formatBytes(images[previewImage.filename].size || 0)
                        : "... bytes"}
                    </Typography>
                    {methodListString && (
                      <Typography variant="body2">
                        Method: {methodListString}.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </Box>
            <Box>
              <IconButton
                sx={{ "&:disabled": { opacity: 0.2 } }}
                disabled={
                  imagesFileNameArray.indexOf(previewImage?.filename!) ===
                  imagesFileNameArray.length - 1
                }
                onClick={() => onViewNextImages(previewImage?.filename!)}
              >
                <ArrowForwardIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default PreviewImageModal;
