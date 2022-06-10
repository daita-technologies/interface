import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import lodash from "lodash";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// import { AutoSizer, List } from "react-virtualized";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Link, TabPanel, MyButton } from "components";

import {
  a11yProps,
  formatBytes,
  getLocalStorage,
  objectIndexOf,
  switchTabIdToSource,
} from "utils/general";
import {
  AUGMENT_SOURCE,
  ID_TOKEN_NAME,
  PREPROCESS_SOURCE,
  AUGMENT_IMAGES_TAB,
  ORIGINAL_IMAGES_TAB,
  PREPROCESS_IMAGES_TAB,
} from "constants/defaultValues";
import { DATASET_HEALTH_CHECK_ROUTE_NAME } from "constants/routeName";

import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { RootState } from "reduxes";
import {
  changeActiveImagesTab,
  fetchImages,
  resetAlbumState,
  resetSelectedList,
  selectImage,
  unselectImage,
} from "reduxes/album/action";
import {
  selectorActiveImagesTabId,
  selectorAlbumMode,
  selectorImages,
  selectorIsFetchingInitialLoad,
  selectorNextToken,
  selectorSelectedList,
} from "reduxes/album/selector";
import { ImageApiFields, TAB_ID_TYPE } from "reduxes/album/type";

import { ALBUM_SELECT_MODE } from "reduxes/album/constants";
import { selectorMethodList } from "reduxes/project/selector";
import { MethodInfoFields } from "reduxes/project/type";

import DownloadButton from "../DownloadButton";
import { AlbumViewerProps } from "../type";
import SelectButton from "../SelectButton";

const IMAGES_PER_ROW = 10;
const IMAGE_SIZE = 100;
const IMAGE_LIST_HTML_ID = "image-list";

const TAB_NAME = "album";

const ImageRow = function ({
  rowImageFileNameArray,
  setPreviewImage,
}: {
  rowImageFileNameArray: Array<string>;
  setPreviewImage: (image: ImageApiFields | null) => void;
}) {
  const dispatch = useDispatch();
  const images = useSelector(selectorImages);

  const albumMode = useSelector(selectorAlbumMode);
  const selectedList = useSelector(selectorSelectedList);
  const isAlbumSelectMode = albumMode === ALBUM_SELECT_MODE;

  const onClickSelectImage = (fileName: string) => {
    if (selectedList.indexOf(fileName) > -1) {
      dispatch(unselectImage({ fileName }));
    } else {
      dispatch(selectImage({ fileName }));
    }
  };

  return (
    <ImageList
      id={IMAGE_LIST_HTML_ID}
      sx={{ width: 10 * IMAGE_SIZE, height: IMAGE_SIZE + 4 }}
      cols={10}
      rowHeight={IMAGE_SIZE}
    >
      {rowImageFileNameArray.map((fileName: string) => (
        <ImageListItem
          sx={{
            cursor: images[fileName].url ? "pointer" : "default",
            overflow: "hidden",
          }}
          key={images[fileName].photoKey}
          onClick={() =>
            !isAlbumSelectMode && images[fileName].url
              ? setPreviewImage(images[fileName])
              : onClickSelectImage(fileName)
          }
        >
          {images[fileName].url ? (
            <Box width="100%" height="100%" position="relative">
              {isAlbumSelectMode && (
                <Box
                  position="absolute"
                  bgcolor="rgba(0,0,0,0.4)"
                  width="100%"
                  height="100%"
                >
                  <Checkbox
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    checked={selectedList.indexOf(fileName) > -1}
                  />
                </Box>
              )}
              <img
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={images[fileName].url}
                alt="ts"
                loading="lazy"
              />
            </Box>
          ) : (
            <Skeleton
              variant="rectangular"
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
            />
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
};

const AlbumViewer = function (props: AlbumViewerProps) {
  const { projectName } = useParams<{ projectName: string }>();

  const dispatch = useDispatch();
  const isFetchingInitialLoad = useSelector(selectorIsFetchingInitialLoad);
  const images = useSelector(selectorImages);
  const imagesFileNameArray = Object.keys(images);
  const imagesFileNameArrayGrouped = lodash.chunk(
    imagesFileNameArray,
    IMAGES_PER_ROW
  );
  const imagesFileNameArrayGroupedLength = imagesFileNameArrayGrouped.length;
  const [previewImage, setPreviewImage] = useState<ImageApiFields | null>(null);
  const nextToken = useSelector(selectorNextToken);
  const activeImagesTabId = useSelector(selectorActiveImagesTabId);

  const s3 = useSelector((state: RootState) => state.generalReducer.s3);
  const hasMore = nextToken !== null;

  const listMethod = useSelector(selectorMethodList);

  const { projectId } = props;

  useEffect(() => {
    if (s3) {
      setTimeout(() => {
        dispatch(
          fetchImages({
            idToken: getLocalStorage(ID_TOKEN_NAME) || "",
            projectId,
            nextToken: "",
            typeMethod: switchTabIdToSource(activeImagesTabId),
          })
        );
      }, 1000);
    }
  }, [s3]);

  useEffect(
    () => () => {
      dispatch(resetAlbumState());
    },
    []
  );

  const onLoadMoreImage = () => {
    dispatch(
      fetchImages({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId,
        nextToken,
        typeMethod: switchTabIdToSource(activeImagesTabId),
      })
    );
  };

  const onChangeImagesTab = (event: any, newActiveTabId: TAB_ID_TYPE) => {
    dispatch(changeActiveImagesTab({ tabId: newActiveTabId, projectId }));
    dispatch(resetSelectedList());
  };

  useEffect(() => {
    if (imagesFileNameArrayGroupedLength) {
      const imageListArea = document.getElementById(IMAGE_LIST_HTML_ID);
      if (imageListArea) {
        const isScrollbarVisible =
          imageListArea.scrollHeight > imageListArea.clientHeight;
        if (!isScrollbarVisible && hasMore) {
          onLoadMoreImage();
        }
      }
    }
  }, [imagesFileNameArrayGroupedLength]);

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

  const convertMethodCodeToName = (image: ImageApiFields | null) => {
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
                  usingListMethod[matchMethodIndex].method_name.replace(
                    /_/g,
                    " "
                  )
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

  const renderPreviewImage = function () {
    const methodListString = convertMethodCodeToName(previewImage).join(", ");
    return (
      <Modal open={!!previewImage} onClose={() => setPreviewImage(null)}>
        <Box sx={modalStyle} bgcolor="background.paper">
          <IconButton
            sx={modalCloseStyle}
            onClick={() => setPreviewImage(null)}
          >
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
                    <CardMedia
                      sx={{
                        objectFit: "contain",
                        width: "60vw",
                        height: "60vh",
                        maxHeight: "60vh",
                        maxWidth: "60vw",
                      }}
                      component="img"
                      src={previewImage.url}
                      alt="ts"
                    />

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
                        Size: {formatBytes(previewImage.size || 0)}
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
  };

  const renderImages = () => {
    if (isFetchingInitialLoad === null || isFetchingInitialLoad === true) {
      return (
        <Box
          minHeight={180}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress size={20} />
        </Box>
      );
    }

    if (imagesFileNameArray.length > 0) {
      return (
        <Box display="flex" justifyContent="center">
          <Box
            id={IMAGE_LIST_HTML_ID}
            sx={{
              width: IMAGES_PER_ROW * IMAGE_SIZE + (IMAGES_PER_ROW - 2) * 4,
              height: 2 * IMAGE_SIZE + 4,
              overflowX: "hidden",
            }}
          >
            <InfiniteScroll
              dataLength={imagesFileNameArrayGrouped.length}
              next={onLoadMoreImage}
              hasMore={hasMore}
              loader={
                <Box
                  minHeight={150}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress size={20} />
                </Box>
              }
              scrollableTarget={IMAGE_LIST_HTML_ID}
            >
              {imagesFileNameArrayGrouped.map(
                (rowImageFileNameArray: Array<string>) => (
                  <ImageRow
                    key={`${rowImageFileNameArray.join("-")}`}
                    rowImageFileNameArray={rowImageFileNameArray}
                    setPreviewImage={setPreviewImage}
                  />
                )
              )}
            </InfiniteScroll>
          </Box>
        </Box>
      );
      // <Box
      //   mt={2}
      //   display="grid"
      //   gridTemplateColumns="repeat(auto-fill, minmax(100px, 100px))"
      //   justifyContent="center"
      //   maxHeight={2 * IMAGE_SIZE}
      //   minHeight={2 * IMAGE_SIZE}
      //   overflow="auto"
      // >
      //   {images.map((image: S3Image) => (
      //     <CardMedia
      //       key={`card-meida-${image.photoKey}`}
      //       sx={{ objectFit: "contain" }}
      //       component="img"
      //       src={image.src}
      //       alt="image"
      //       width={IMAGE_SIZE}
      //       height={IMAGE_SIZE}
      //     />
      //   ))}
      // </Box>
    }

    return (
      <Box
        minHeight={180}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontStyle="italic" color="text.secondary">
          You don&lsquo;t have any images.
        </Typography>
      </Box>
    );
  };

  const renderImagesTabs = () => (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeImagesTabId}
          onChange={onChangeImagesTab}
          aria-label="basic tabs example"
        >
          <Tab label="Original" {...a11yProps(TAB_NAME, ORIGINAL_IMAGES_TAB)} />
          <Tab
            label="Preprocessing"
            {...a11yProps(TAB_NAME, PREPROCESS_IMAGES_TAB)}
          />
          <Tab
            label="Augmentation"
            {...a11yProps(TAB_NAME, AUGMENT_IMAGES_TAB)}
          />
        </Tabs>
      </Box>
      <TabPanel
        tabName={TAB_NAME}
        tabId={ORIGINAL_IMAGES_TAB}
        activeTabId={activeImagesTabId}
      >
        {renderImages()}
      </TabPanel>
      <TabPanel
        tabName={TAB_NAME}
        tabId={PREPROCESS_IMAGES_TAB}
        activeTabId={activeImagesTabId}
      >
        {renderImages()}
      </TabPanel>
      <TabPanel
        tabName={TAB_NAME}
        tabId={AUGMENT_IMAGES_TAB}
        activeTabId={activeImagesTabId}
      >
        {renderImages()}
      </TabPanel>
    </Box>
  );

  return (
    <Box>
      {renderPreviewImage()}
      <Box p={2} bgcolor="background.paper" borderRadius={2}>
        <Box display="flex" alignItems="center">
          <Typography fontSize={18}>Your Images</Typography>
          <Box ml={8}>
            <SelectButton />
          </Box>
          <Box ml="auto" display="flex" alignItems="center">
            <MyButton>
              <Link to={`/${DATASET_HEALTH_CHECK_ROUTE_NAME}/${projectName}`}>
                Dataset Health Check
              </Link>
            </MyButton>
            <Box ml={3}>
              <DownloadButton projectId={projectId} />
            </Box>
          </Box>
        </Box>

        {renderImagesTabs()}

        {/* <AutoSizer>
            {({ width, height }) => (
              <List
                height={height}
                width={width}
                rowCount={Math.ceil(images.length / IMAGES_PER_ROW)}
                rowHeight={IMAGE_SIZE}
                rowRenderer={rowRender}
              />
            )}
          </AutoSizer> */}

        {/* <Button>View All Images</Button> */}
      </Box>
    </Box>
  );
};

export default AlbumViewer;
