import { GetObjectCommand } from "@aws-sdk/client-s3";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { MyButton } from "components";
import ImageProcessing from "components/ImageProcessing";
import { PreprocessingMedthod } from "components/ImageProcessing/type";
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
  setReferencePreprocessImage,
  setReferenceSeletectorDialog,
} from "reduxes/customPreprocessing/action";
import { selectorReferenceSeletectorDialog } from "reduxes/customPreprocessing/selector";
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

  const [referenceImage, setReferenceImage] = useState<ImageApiFields>();
  const [images, setImages] = useState<AlbumImagesFields>({});
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const s3 = useSelector(selectorS3);
  const { isShow, method } = useSelector(selectorReferenceSeletectorDialog);

  const handleClose = () => {
    dispatch(setReferenceSeletectorDialog({ isShow: false }));
  };
  useEffect(() => {
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
          setImages(
            convertArrayAlbumImageToObjectKeyFileName(items, ORIGINAL_SOURCE)
          );
        } else {
          toast.error(fetchImagesResponse.message);
        }
        setTimeout(() => {
          setSearchLoading(false);
        }, 5000);
      });
  }, []);
  const handleSubmit = () => {
    if (referenceImage) {
      dispatch(
        setReferencePreprocessImage({
          method: method as PreprocessingMedthod,
          fileName: referenceImage.filename,
        })
      );
      dispatch(setReferenceSeletectorDialog({ isShow: false }));
    } else {
      toast.error("Select your reference image");
    }
  };
  const handleChangeReferenceImage = (event: any, newValue: string | null) => {
    let image = images[newValue as string];
    if (!image) {
      return;
    }
    if (image.url) {
      setReferenceImage(image);
    }
    setReferenceImage(image);
    if (s3) {
      s3.send(
        new GetObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: image.photoKey,
        })
      ).then((photoContent) => {
        if (photoContent.Body) {
          const res = new Response(photoContent.Body as any);
          res.blob().then((blob) => {
            image = {
              ...image,
              blob,
              size: blob.size,
              url: window.URL.createObjectURL(blob),
            };
            images[newValue as string] = image;
            setImages(images);
            setReferenceImage({ ...image });
          });
        }
      });
    }
  };
  const renderImageProcessing = () => {
    if (referenceImage) {
      if (referenceImage.url) {
        return (
          <ImageProcessing
            src={referenceImage.url as string}
            processingMethod={method as PreprocessingMedthod}
          />
        );
      }
      return (
        <Box pl={17} pt={10}>
          <CircularProgress size={40} />
        </Box>
      );
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
          Select Your Reference Image
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
                  id="images"
                  sx={{ width: "100%" }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
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
              <Box sx={{ pl: 1, width: "100%" }} flex={2}>
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
