import { Box } from "@mui/material";
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
} from "reduxes/annotationmanager/action";
import {
  selectorAnnotationManagerImages,
  selectorCurrentPreviewImageName,
  selectorIdDrawObjectByImageName,
} from "reduxes/annotationmanager/selecetor";
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
  const annotationManagerImages = useSelector(selectorAnnotationManagerImages);

  const currentPreviewImageName = useSelector(selectorCurrentPreviewImageName);
  const drawObjectById = useSelector(selectorDrawObjectById);
  const idDrawObjectByImageName = useSelector(selectorIdDrawObjectByImageName);
  useEffect(() => {
    createFile(
      "1.jpg",
      "https://f6-zpcloud.zdn.vn/7198882725419606626/7b6aef0eee3e2c60752f.jpg"
    ).then((image: File) => {
      dispatch(addImagesToAnnotation({ images: [image] }));
      dispatch(changePreviewImage({ imageName: image.name }));
    });
    createFile(
      "2.jpg",
      "https://f7-zpcloud.zdn.vn/2878988493394338713/95e566c7d24b1015495a.jpg"
    ).then((image: File) => {
      dispatch(addImagesToAnnotation({ images: [image] }));
    });
    createFile(
      "3.jpg",
      "https://f7-zpcloud.zdn.vn/2862415249155355802/028d81ae3522f77cae33.jpg"
    ).then((image: File) => {
      dispatch(addImagesToAnnotation({ images: [image] }));
    });
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      dispatch(addImagesToAnnotation({ images: acceptedFiles }));
      if (!currentPreviewImageName) {
        dispatch(changePreviewImage({ imageName: acceptedFiles[0].name }));
      }
    }
  };
  const dropZone = useDropzone({
    onDrop,
    accept: IMAGE_EXTENSIONS.join(","),
    noDragEventsBubbling: true,
  });
  const { getRootProps, isDragActive, getInputProps } = dropZone;
  const fileThumbByImageName = useMemo(() => {
    const thumbs: Record<string, string> = {};
    Object.entries(annotationManagerImages).map(([imageName, image]) => {
      thumbs[imageName] = URL.createObjectURL(image);
    });
    return thumbs;
  }, [annotationManagerImages]);
  const handleSelectPreview = (imageName: string) => {
    if (currentPreviewImageName) {
      dispatch(
        saveAnnotationStateManager({
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
  return (
    <Box display="flex" gap={2} height="25vh" sx={{ padding: "30px 30px" }}>
      <Box
        sx={{
          background: `url("/assets/images/upload-image.png") no-repeat center`,
          border: "1px solid",
          backgroundSize: 30,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "text.secondary",
          cursor: "pointer",
        }}
        width="250px"
        position="relative"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
      </Box>
      {Object.entries(annotationManagerImages).map(([imageName, image]) => {
        return (
          <Box
            key={imageName}
            sx={{
              background: `url(${fileThumbByImageName[imageName]})`,
              border:
                imageName === currentPreviewImageName
                  ? "5px solid red"
                  : "1px solid",
              backgroundSize: "cover",
            }}
            width="250px"
            position="relative"
            onClick={() => {
              handleSelectPreview(imageName);
            }}
          />
        );
      })}
    </Box>
  );
};
export default ImagePreview;
