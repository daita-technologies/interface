import { Box, List, ListItem, Skeleton, Typography } from "@mui/material";
import { loadImage } from "components/UploadFile";
import { IMAGE_EXTENSIONS } from "constants/defaultValues";
import { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { resetCurrentStateDrawObject } from "reduxes/annotation/action";
import { selectorDrawObjectById } from "reduxes/annotation/selector";
import {
  addImagesToAnnotation,
  changePreviewImage,
  saveAnnotationStateManager,
  setAnnotationStateManager,
} from "reduxes/annotationmanager/action";
import {
  selectorAnnotationManagerImages,
  selectorCurrentPreviewImageName,
  selectorIdDrawObjectByImageName,
} from "reduxes/annotationmanager/selecetor";
import { AnnotationImagesProperty } from "reduxes/annotationmanager/type";
import { selectorCurrentAnnotationFiles } from "reduxes/annotationProject/selector";

const createFile = async (imageName: string, url: string) => {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: "image/jpeg",
  };
  let file = new File([data], imageName, metadata);
  return file;
};
const ImagePreview = function () {
  const dispatch = useDispatch();
  // const annotationManagerImages = useSelector(selectorAnnotationManagerImages);

  const currentPreviewImageName = useSelector(selectorCurrentPreviewImageName);
  const drawObjectById = useSelector(selectorDrawObjectById);
  const idDrawObjectByImageName = useSelector(selectorIdDrawObjectByImageName);
  const currentAnnotationFiles = useSelector(selectorCurrentAnnotationFiles);

  // useEffect(() => {
  //   if (currentAnnotationFiles) {
  //     currentAnnotationFiles.items.map((item) => {
  //       // dispatch(
  //       //   addImagesToAnnotation({
  //       //     annotationImagesProperties: [{ image, width: 1920, height: 1208 }],
  //       //   })
  //       // );
  //     });
  //   }
  // }, [currentAnnotationFiles]);

  useEffect(() => {
    if (currentAnnotationFiles) {
      dispatch(
        changePreviewImage({
          imageName: currentAnnotationFiles.items[0].filename,
        })
      );
    }

    // createFile(
    //   "1.jpg",
    //   "https://annotaion-test-image.s3.us-east-2.amazonaws.com/20180810150607_camera_frontcenter_000000083.png"
    // ).then((image: File) => {
    //   dispatch(
    //     addImagesToAnnotation({
    //       annotationImagesProperties: [{ image, width: 1920, height: 1280 }],
    //     })
    //   );
    //   dispatch(changePreviewImage({ imageName: image.name }));
    // });
    // createFile(
    //   "2.jpg",
    //   "https://f7-zpcloud.zdn.vn/2878988493394338713/95e566c7d24b1015495a.jpg"
    // ).then((image: File) => {
    //   dispatch(
    //     addImagesToAnnotation({
    //       annotationImagesProperties: [{ image, width: 1920, height: 1208 }],
    //     })
    //   );
    //   dispatch(changePreviewImage({ imageName: image.name }));
    // });
    // createFile(
    //   "12.jpg",
    //   "https://f7-zpcloud.zdn.vn/4784546116146105845/643ce7db986f5a31037e.jpg"
    // ).then((image: File) => {
    //   dispatch(addImagesToAnnotation({ images: [image] }));
    //   dispatch(changePreviewImage({ imageName: image.name }));
    // });
    // createFile(
    //   "3.jpg",
    //   "https://f7-zpcloud.zdn.vn/2862415249155355802/028d81ae3522f77cae33.jpg"
    // ).then((image: File) => {
    //   dispatch(addImagesToAnnotation({ images: [image] }));
    // });
    // createFile(
    //   "4.jpg",
    //   "https://f7-zpcloud.zdn.vn/2862415249155355802/028d81ae3522f77cae33.jpg"
    // ).then((image: File) => {
    //   dispatch(addImagesToAnnotation({ images: [image] }));
    // });
    // createFile(
    //   "5.jpg",
    //   "https://f7-zpcloud.zdn.vn/2862415249155355802/028d81ae3522f77cae33.jpg"
    // ).then((image: File) => {
    //   dispatch(addImagesToAnnotation({ images: [image] }));
    // });
    // createFile(
    //   "6.jpg",
    //   "https://f7-zpcloud.zdn.vn/2862415249155355802/028d81ae3522f77cae33.jpg"
    // ).then((image: File) => {
    //   dispatch(addImagesToAnnotation({ images: [image] }));
    // });
    // createFile(
    //   "7.jpg",
    //   "https://f7-zpcloud.zdn.vn/2862415249155355802/028d81ae3522f77cae33.jpg"
    // ).then((image: File) => {
    //   dispatch(addImagesToAnnotation({ images: [image] }));
    // });
  }, []);

  // const onDrop = (acceptedFiles: File[]) => {
  //   if (acceptedFiles && acceptedFiles.length > 0) {
  //     for (const file of acceptedFiles) {
  //       loadImage(file).then(({ image, fileName }) => {
  //         const property: AnnotationImagesProperty = {
  //           image: file,
  //           width: image.width,
  //           height: image.height,
  //         };
  //         dispatch(
  //           addImagesToAnnotation({ annotationImagesProperties: [property] })
  //         );
  //         if (!currentPreviewImageName) {
  //           dispatch(changePreviewImage({ imageName: acceptedFiles[0].name }));
  //         }
  //       });
  //     }
  //   }
  // };
  // const dropZone = useDropzone({
  //   onDrop,
  //   accept: IMAGE_EXTENSIONS.join(","),
  //   noDragEventsBubbling: true,
  // });
  // const { getRootProps, isDragActive, getInputProps } = dropZone;
  // const fileThumbByImageName = useMemo(() => {
  //   const thumbs: Record<string, string> = {};
  //   Object.entries(annotationManagerImages).map(
  //     ([imageName, annotationImagesProperty]) => {
  //       thumbs[imageName] = URL.createObjectURL(annotationImagesProperty.image);
  //     }
  //   );
  //   return thumbs;
  // }, [annotationManagerImages]);
  const handleSelectPreview = (imageName: string) => {
    if (imageName === currentPreviewImageName) {
      return;
    }
    if (currentPreviewImageName) {
      dispatch(
        setAnnotationStateManager({
          imageName: currentPreviewImageName,
          drawObjectById,
        })
      );
    }
    dispatch(
      resetCurrentStateDrawObject({
        drawObjectById: idDrawObjectByImageName[imageName],
      })
    );
    dispatch(changePreviewImage({ imageName }));
  };
  const renderContent = () => {
    if (!currentAnnotationFiles) {
      return <Skeleton variant="circular" width={40} height={40} />;
    }
    return (
      <>
        {/* <Box
          sx={{
            background: `url("/assets/images/upload-image.png") no-repeat center`,
            border: "1px solid",
            backgroundSize: 30,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: "text.secondary",
            cursor: "pointer",
          }}
          width={200}
          position="relative"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
        </Box> */}
        <List
          sx={{
            maxWidth: "90%",
            overflow: "auto",
            display: "flex",
            flexDirection: "row",
            padding: 0,
          }}
        >
          {currentAnnotationFiles.items.map((item) => {
            return (
              <ListItem key={item.filename}>
                <Box
                  sx={{
                    // background: `url(${fileThumbByImageName[imageName]})no-repeat center`,
                    border:
                      item.filename === currentPreviewImageName
                        ? "3px solid red"
                        : "1px solid",
                    backgroundSize: "contain",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  width="250px"
                  position="relative"
                  onClick={() => {
                    handleSelectPreview(item.filename);
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    height="100%"
                    alignItems="center"
                  >
                    <Typography
                      sx={{
                        color: "text.primary",
                        p: 1,
                      }}
                      noWrap
                    >
                      {item.filename}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  };
  return (
    <Box
      display="flex"
      gap={2}
      height="25vh"
      minHeight={200}
      sx={{ padding: "30px 30px" }}
    >
      {renderContent()}
    </Box>
  );
};
export default ImagePreview;
