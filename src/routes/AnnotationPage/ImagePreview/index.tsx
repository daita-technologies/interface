import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Button,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { BeforeUnload } from "components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCurrentStateDrawObject } from "reduxes/annotation/action";
import { selectorAnnotationStatehHistory } from "reduxes/annotation/selector";
import { requestChangePreviewImage } from "reduxes/annotationmanager/action";
import {
  selectorCurrentPreviewImageName,
  selectorIdDrawObjectByImageName,
} from "reduxes/annotationmanager/selecetor";
import { selectorCurrentAnnotationFiles } from "reduxes/annotationProject/selector";
import { QUIT_ANNOTATION_EDITOR_PROMPT_MESSAGE } from "../constants";
import ChangePreviewConfirmDialog from "./ChangePreviewConfirmDialog";
import ImagePreviewBadge from "./ImagePreviewBadge";

function ImagePreview() {
  const dispatch = useDispatch();
  const currentPreviewImageName = useSelector(selectorCurrentPreviewImageName);
  const idDrawObjectByImageName = useSelector(selectorIdDrawObjectByImageName);
  const currentAnnotationFiles = useSelector(selectorCurrentAnnotationFiles);
  const annotationStatehHistory = useSelector(selectorAnnotationStatehHistory);
  const [isOpenDiaglog, setIsOpenDiaglog] = useState<boolean>(false);
  const [nextPreviewImageName, setNextPreviewImageName] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (currentAnnotationFiles) {
      dispatch(
        requestChangePreviewImage({
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

  const needConfirmChangePreviewImageDialog = useMemo(
    () =>
      annotationStatehHistory.stateHistoryItems[
        annotationStatehHistory.historyStep - 1
      ] &&
      annotationStatehHistory.savedStateHistoryId !==
        annotationStatehHistory.stateHistoryItems[
          annotationStatehHistory.historyStep - 1
        ].id,
    [annotationStatehHistory]
  );

  const handleSelectPreview = (imageName: string) => {
    if (imageName === currentPreviewImageName) {
      return;
    }
    if (!needConfirmChangePreviewImageDialog) {
      dispatch(
        resetCurrentStateDrawObject({
          drawObjectById: idDrawObjectByImageName[imageName],
        })
      );
      dispatch(requestChangePreviewImage({ imageName }));
      return;
    }
    setNextPreviewImageName(imageName);
    setIsOpenDiaglog(true);
  };
  const handleCloseDialog = () => {
    setIsOpenDiaglog(false);
  };

  const refList = useRef<HTMLUListElement>(null);
  // refList.current?.scroll
  const scrollLeft = () => {
    refList.current?.scroll({ left: refList.current.scrollLeft - 500 });
  };
  const scrollRight = () => {
    if (refList.current) {
      refList.current.scroll({ left: refList.current.scrollLeft + 500 });
    }
  };
  const renderContent = () => {
    if (!currentAnnotationFiles) {
      return <Skeleton variant="circular" width={40} height={40} />;
    }
    return (
      <>
        <BeforeUnload
          isActive={!!needConfirmChangePreviewImageDialog}
          message={QUIT_ANNOTATION_EDITOR_PROMPT_MESSAGE}
        />
        <Box display="flex">
          <Button
            color="primary"
            startIcon={<ArrowBackIosIcon />}
            onClick={scrollLeft}
          />
          <List
            sx={{
              overflow: "auto",
              display: "flex",
              flexDirection: "row",
              padding: 0,
              width: "92vw",
              lineHeight: "8vh",
            }}
            ref={refList}
            id="scrollTest"
          >
            {currentAnnotationFiles.items.map((item) => (
              <ListItem key={item.filename}>
                <ImagePreviewBadge filename={item.filename}>
                  <Box
                    sx={{
                      // background: `url(${fileThumbByImageName[imageName]})no-repeat center`,
                      border:
                        item.filename === currentPreviewImageName
                          ? "3px solid red"
                          : "1px solid",
                      backgroundSize: "contain",
                      height: 60,
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
                </ImagePreviewBadge>
              </ListItem>
            ))}
          </List>
          <Button
            color="primary"
            startIcon={<ArrowForwardIosIcon />}
            onClick={scrollRight}
          />
        </Box>
        {currentPreviewImageName && nextPreviewImageName && (
          <ChangePreviewConfirmDialog
            isOpen={isOpenDiaglog}
            imageName={currentPreviewImageName}
            nextPreviewImageName={nextPreviewImageName}
            onClose={handleCloseDialog}
          />
        )}
      </>
    );
  };
  return <>{renderContent()}</>;
}
export default ImagePreview;
