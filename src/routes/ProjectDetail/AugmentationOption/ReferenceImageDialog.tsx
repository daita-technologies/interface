import { GetObjectCommand } from "@aws-sdk/client-s3";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { MyButton } from "components";
import ImageProcessing from "components/ImageProcessing";
import { AugmentationMethod } from "components/ImageProcessing/type";
import {
  ID_TOKEN_NAME,
  MAXIMUM_FETCH_IMAGES_AMOUNT,
  ORIGINAL_SOURCE,
} from "constants/defaultValues";
import { S3_BUCKET_NAME } from "constants/s3Values";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AlbumImagesFields, ImageApiFields } from "reduxes/album/type";
import {
  setReferenceAugmentationImage,
  setReferenceSeletectorDialog,
} from "reduxes/customAugmentation/action";
import {
  selectorReferenceAugmentationImage,
  selectorReferenceSeletectorDialog,
} from "reduxes/customAugmentation/selector";
import { selectorS3 } from "reduxes/general/selector";
import { selectorCurrentProjectId } from "reduxes/project/selector";
import { projectApi } from "services";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import {
  convertArrayAlbumImageToObjectKeyFileName,
  getLocalStorage,
} from "utils/general";

const ReferenceImageDialog = function () {
  const dispatch = useDispatch();

  const [referenceImage, setReferenceImage] =
    useState<Pick<ImageApiFields, "filename" | "url" | "photoKey">>();
  const [images, setImages] = useState<AlbumImagesFields>({});
  const [referenceImageName, setReferenceImageName] = useState<string>();
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const currentProjectId = useSelector(selectorCurrentProjectId);

  const s3 = useSelector(selectorS3);
  const { isShow, method } = useSelector(selectorReferenceSeletectorDialog);
  const handleClose = () => {
    dispatch(setReferenceSeletectorDialog({ isShow: false }));
  };
  const referenceAugmentationImage = useSelector(
    selectorReferenceAugmentationImage
  );
  useEffect(() => {
    if (currentProjectId) {
      if (isShow === false || !method) {
        setReferenceImage(undefined);
        setImages({});
        setReferenceImageName(undefined);
        return;
      }
      const savedReferenceImage = referenceAugmentationImage[method]
        ?.filename as string;
      if (referenceAugmentationImage[method]) {
        setReferenceImageName(savedReferenceImage);
      }
      setSearchLoading(true);
      projectApi
        .listData({
          idToken: getLocalStorage(ID_TOKEN_NAME) as string,
          projectId: currentProjectId,
          nextToken: "",
          typeMethod: ORIGINAL_SOURCE,
          numLimit: MAXIMUM_FETCH_IMAGES_AMOUNT,
        })
        .then((fetchImagesResponse: any) => {
          if (!fetchImagesResponse.error) {
            const { items } = fetchImagesResponse.data;
            const tempImage = convertArrayAlbumImageToObjectKeyFileName(
              items,
              ORIGINAL_SOURCE
            );
            setImages(tempImage);
            if (savedReferenceImage) {
              setReferenceImage(tempImage[savedReferenceImage]);
            }
          } else {
            toast.error(fetchImagesResponse.message);
          }
          setSearchLoading(false);
        });
    }
  }, [isShow, currentProjectId]);
  const handleSubmit = () => {
    if (referenceImage) {
      dispatch(
        setReferenceAugmentationImage({
          method: method as AugmentationMethod,
          filename: referenceImage.filename,
        })
      );
      dispatch(setReferenceSeletectorDialog({ isShow: false }));
    } else {
      toast.error("Select your reference image");
    }
  };
  const getDataImage = (photoKey: string) =>
    new Promise<Blob>((resolve, reject) => {
      if (s3) {
        s3.send(
          new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: photoKey,
          })
        ).then((photoContent) => {
          if (photoContent.Body) {
            const res = new Response(photoContent.Body as any);
            res.blob().then((blob) => {
              resolve(blob);
            });
          } else {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  const handleChangeReferenceImage = (event: any, newValue: string | null) => {
    if (newValue === null) {
      return;
    }
    setReferenceImage(images[newValue as string]);
  };

  useEffect(() => {
    if (referenceImage && referenceImage.photoKey) {
      const cachedImage = images[referenceImage.filename];
      if (cachedImage && cachedImage.url !== "") {
        setReferenceImage(cachedImage);
      } else {
        getDataImage(referenceImage.photoKey).then((blob) => {
          const image = {
            ...images[referenceImage.filename],
            blob,
            size: blob.size,
            url: window.URL.createObjectURL(blob),
          };
          images[referenceImage.filename] = image;
          setImages(images);
          setReferenceImage({ ...image });
        });
      }
    }
  }, [referenceImage?.filename]);
  const renderImageProcessing = () => {
    if (referenceImage) {
      if (referenceImage && referenceImage.url && referenceImage.url !== "") {
        return (
          <Box display="flex">
            <ImageProcessing
              src={referenceImage.url as string}
              method={method as AugmentationMethod}
            />
          </Box>
        );
      }
      return <Skeleton variant="rectangular" width="100%" height={200} />;
    }
    return "";
  };
  return (
    <Modal open={isShow} onClose={handleClose} disableEscapeKeyDown>
      <Box sx={{ ...modalStyle, width: 800, height: 500 }}>
        <IconButton sx={modalCloseStyle} onClick={handleClose}>
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          Please Select Your Reference Image
        </Typography>
        <Box marginTop={5} height="70%">
          <Box height="100%">
            <Typography variant="h6" fontWeight={500}>
              {method}
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              marginTop={2}
              height="90%"
            >
              <Box flex={2}>
                <Typography
                  mb={2}
                  variant="body1"
                  fontWeight={400}
                  color="text.secondary"
                >
                  Select your reference image by file name
                </Typography>
                <Autocomplete
                  fullWidth
                  sx={{ width: "100%" }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  value={referenceImageName}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option: string) => option}
                  options={images ? Object.keys(images) : []}
                  loading={searchLoading && open}
                  onChange={handleChangeReferenceImage}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a reference image"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchLoading && open ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ backgroundColor: "text.secondary", margin: 2 }}
              />
              <Box pl={1} flex={2} width="100%" height="100%">
                <Typography
                  variant="body1"
                  fontWeight={400}
                  mb={2}
                  color="text.secondary"
                >
                  Your Selection
                </Typography>
                {renderImageProcessing()}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <MyButton
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Aplly
          </MyButton>
        </Box>
      </Box>
    </Modal>
  );
};
export default ReferenceImageDialog;