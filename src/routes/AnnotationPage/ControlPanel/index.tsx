import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Crop32Icon from "@mui/icons-material/Crop32";
import HexagonIcon from "@mui/icons-material/Hexagon";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import NearMeIcon from "@mui/icons-material/NearMe";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { LoadingButton } from "@mui/lab";
import {
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CssStyle } from "components/Annotation/Editor/type";
import { getFitScaleEditor } from "components/Annotation/Editor/utils";
import {
  exportAnnotationDaita,
  exportAnnotationLabelBox,
  exportAnnotationLabelMe,
  exportAnnotationScaleAI,
  importAnnotationLabelMe,
  importAnnotationScaleAI,
  importFileAnnotationDaita,
} from "components/Annotation/Formart";
import TooltipToggleButton from "components/TooltipToggleButton";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  changeCurrentDrawState,
  changeCurrentDrawType,
  changeZoom,
  createDrawObject,
  hiddenAllDrawObjectStateIdByAI,
  redoDrawObject,
  resetCurrentStateDrawObject,
  showAllDrawObjectStateIdByAI,
  undoDrawObject,
} from "reduxes/annotation/action";
import {
  selectorAnnotationStatehHistory,
  selectorCurrentDrawState,
  selectorCurrentDrawType,
  selectorDrawObjectById,
  selectorDrawObjectStateIdByAI,
} from "reduxes/annotation/selector";
import { DrawObject, DrawState, DrawType } from "reduxes/annotation/type";
import {
  addImagesToAnnotation,
  addNewClassLabel,
  saveAnnotationStateManager,
  setAnnotationStateManager,
  setPreviewImage,
} from "reduxes/annotationmanager/action";
import {
  selectorCurrentAnnotationFile,
  selectorCurrentPreviewImageName,
  selectorIsSavingAnnotation,
  selectorLabelClassPropertiesByLabelClass,
} from "reduxes/annotationmanager/selecetor";
import { selectorAnnotationCurrentProjectName } from "reduxes/annotationProject/selector";
import {
  DRAW_ELLIPSE_SHORT_KEY,
  DRAW_SEGMENTATION_SHORT_KEY,
  DRAW_POLYGON_SHORT_KEY,
  DRAW_RECTANGLE_SHORT_KEY,
  SELECT_SHORT_KEY,
  DRAW_LINE_SHORT_KEY,
} from "../constants";
import { convertStrokeColorToFillColor } from "../LabelAnnotation/ClassLabel";
import {
  hashCode,
  intToRGB,
} from "../LabelAnnotation/ClassManageModal/useListClassView";

function ControlPanel() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentDrawType = useSelector(selectorCurrentDrawType);
  const currentDrawState = useSelector(selectorCurrentDrawState);
  // const [drawType, setDrawType] = React.useState<DrawType | null>();
  // const [drawState, setDrawState] = React.useState<DrawState | null>();
  const drawObjectById = useSelector(selectorDrawObjectById);
  const annotationCurrentProjectName = useSelector(
    selectorAnnotationCurrentProjectName
  );
  const savedCurrentAnnotationProjectName = React.useRef<string>("");
  const currentPreviewImageName = useSelector(selectorCurrentPreviewImageName);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const isSavingAnnotation = useSelector(selectorIsSavingAnnotation);
  const drawObjectStateIdByAI = useSelector(selectorDrawObjectStateIdByAI);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;
  const [importType, setImportType] = React.useState<
    "LABEL_ME" | "SCALE_AI" | "LABEL_BOX" | "DAITA"
  >("LABEL_ME");

  const annotationStatehHistory = useSelector(selectorAnnotationStatehHistory);
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );

  React.useEffect(() => {
    if (annotationCurrentProjectName) {
      savedCurrentAnnotationProjectName.current = annotationCurrentProjectName;
    }
  }, [annotationCurrentProjectName]);

  const resetScaleHandler = () => {
    if (currentAnnotationFile) {
      const { width, height } = currentAnnotationFile;
      const zoom = getFitScaleEditor(width, height);
      dispatch(
        changeZoom({
          zoom: { zoom, position: { x: 0, y: 0 } },
        })
      );
    }
  };

  const selectModeHandle = (
    event: React.MouseEvent<HTMLElement>,
    type: DrawType
  ) => {
    dispatch(changeCurrentDrawType({ currentDrawType: type }));
    dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
  };
  const handleSelectDrawState = (
    event: React.MouseEvent<HTMLElement>,
    state: DrawState
  ) => {
    dispatch(changeCurrentDrawState({ drawState: state }));
    dispatch(changeCurrentDrawType({ currentDrawType: null }));
  };
  const getDrawObjectToExport = () => {
    if (drawObjectById) {
      const filteredDrawObjectById = { ...drawObjectById };
      Object.keys(drawObjectStateIdByAI).forEach((drawObjectId) => {
        delete filteredDrawObjectById[drawObjectId];
      });
      return filteredDrawObjectById;
    }
    return null;
  };
  const handleExportLabelMe = () => {
    const drawObjectToExport = getDrawObjectToExport();
    if (currentAnnotationFile && drawObjectToExport) {
      exportAnnotationLabelMe(
        currentAnnotationFile,
        drawObjectToExport,
        currentPreviewImageName
      );
    }
  };
  const handleExportScaleAI = () => {
    const drawObjectToExport = getDrawObjectToExport();
    if (drawObjectToExport) {
      exportAnnotationScaleAI(drawObjectToExport, currentPreviewImageName);
    }
  };
  const handleExportLabelBox = () => {
    const drawObjectToExport = getDrawObjectToExport();
    if (drawObjectToExport) {
      exportAnnotationLabelBox(drawObjectToExport, currentPreviewImageName);
    }
  };
  const handleExportDaita = () => {
    const drawObjectToExport = getDrawObjectToExport();
    if (drawObjectToExport) {
      exportAnnotationDaita(
        drawObjectToExport,
        currentPreviewImageName || "imagename"
      );
    }
  };
  const updateDrawObject = (value: DrawObject) => {
    const drawObjectRet: DrawObject = { ...value };
    const { label } = value.data.label;
    let classLabel = labelClassPropertiesByLabelClass[label];
    if (!classLabel) {
      const strokeColor = `#${intToRGB(hashCode(label))}`;
      const fillColor = convertStrokeColorToFillColor(strokeColor);
      classLabel = {
        label: { label },
        cssStyle: {
          fill: fillColor,
          stroke: strokeColor,
        } as CssStyle,
      };
      dispatch(addNewClassLabel({ labelClassProperties: classLabel }));
    }

    const css = drawObjectRet.data.cssStyle;
    const newCss = classLabel.cssStyle;
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const prop in css) {
      drawObjectRet.data.cssStyle = {
        ...drawObjectRet.data.cssStyle,
        [prop]:
          newCss && newCss[prop as keyof CssStyle]
            ? newCss[prop as keyof CssStyle]
            : css[prop as keyof CssStyle],
      };
    }
    return drawObjectRet;
  };
  const importLabelMe = async (acceptedFile: File) => {
    const { annotationImagesProperty, drawObjectById: imnportDrawObjectById } =
      await importAnnotationLabelMe(acceptedFile);
    Object.entries(imnportDrawObjectById).forEach(([key, value]) => {
      imnportDrawObjectById[key] = updateDrawObject(value);
    });
    dispatch(
      addImagesToAnnotation({
        annotationImagesProperties: [annotationImagesProperty],
      })
    );
    dispatch(
      setAnnotationStateManager({
        imageName: annotationImagesProperty.image.name,
        drawObjectById: imnportDrawObjectById,
      })
    );

    dispatch(
      resetCurrentStateDrawObject({
        drawObjectById,
      })
    );
    dispatch(
      setPreviewImage({
        imageName: annotationImagesProperty.image.name,
      })
    );
  };
  const importDaita = async (acceptedFile: File) => {
    const { annotationImagesProperty, drawObjectById: importDrawObjectById } =
      await importFileAnnotationDaita(acceptedFile);
    Object.entries(importDrawObjectById).forEach(([key, value]) => {
      importDrawObjectById[key] = updateDrawObject(value);
    });
    dispatch(
      addImagesToAnnotation({
        annotationImagesProperties: [annotationImagesProperty],
      })
    );
    dispatch(
      setAnnotationStateManager({
        imageName: annotationImagesProperty.image.name,
        drawObjectById: importDrawObjectById,
      })
    );

    dispatch(
      resetCurrentStateDrawObject({
        drawObjectById: importDrawObjectById,
      })
    );
    dispatch(
      setPreviewImage({
        imageName: annotationImagesProperty.image.name,
      })
    );
  };
  const importScaleAI = async (acceptedFile: File) => {
    const { drawObjectById: importDrawObjectById } =
      await importAnnotationScaleAI(acceptedFile);
    // dispatch(
    //   resetCurrentStateDrawObject({
    //     drawObjectById: drawObjectById,
    //   })
    // );
    Object.entries(importDrawObjectById).forEach(([key, value]) => {
      importDrawObjectById[key] = updateDrawObject(value);
      dispatch(
        createDrawObject({
          drawObject: importDrawObjectById[key],
        })
      );
    });
  };
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const snapImportType = importType;
      acceptedFiles.forEach((acceptedFile) => {
        if (snapImportType === "LABEL_ME") {
          importLabelMe(acceptedFile);
        } else if (snapImportType === "SCALE_AI") {
          importScaleAI(acceptedFile);
        } else if (snapImportType === "DAITA") {
          importDaita(acceptedFile);
        }
      });
    }
  };
  const dropZone = useDropzone({
    onDrop,
    accept: ".json",
    noDragEventsBubbling: true,
  });
  const { getRootProps, getInputProps } = dropZone;
  const handleUndoDrawObject = () => {
    dispatch(undoDrawObject());
  };
  const handleRedoDrawObject = () => {
    dispatch(redoDrawObject());
  };

  const handleClickExport = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveAnnotation = () => {
    if (currentPreviewImageName) {
      dispatch(
        saveAnnotationStateManager({
          imageName: currentPreviewImageName,
          drawObjectById,
        })
      );
    }
  };
  const renderPopupContent = () => {
    if (anchorEl?.id === "import") {
      return (
        <List>
          <ListItem disablePadding {...getRootProps()}>
            <input {...getInputProps()} />
            <ListItemButton
              onClick={() => {
                setImportType("LABEL_ME");
              }}
            >
              <ListItemText primary="Labelme" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding {...getRootProps()}>
            <input {...getInputProps()} />
            <ListItemButton
              onClick={() => {
                setImportType("SCALE_AI");
              }}
            >
              <ListItemText primary="Scale AI" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding {...getRootProps()}>
            <input {...getInputProps()} />
            <ListItemButton
              onClick={() => {
                setImportType("LABEL_BOX");
              }}
            >
              <ListItemText primary="Labelbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding {...getRootProps()}>
            <input {...getInputProps()} />
            <ListItemButton
              onClick={() => {
                setImportType("DAITA");
              }}
            >
              <ListItemText primary="Daita" />
            </ListItemButton>
          </ListItem>
        </List>
      );
    }
    if (anchorEl?.id === "export") {
      return (
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Labelme" onClick={handleExportLabelMe} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleExportScaleAI}>
            <ListItemButton>
              <ListItemText primary="Scale AI" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleExportLabelBox}>
            <ListItemButton>
              <ListItemText primary="Labelbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleExportDaita}>
            <ListItemButton>
              <ListItemText primary="Daita" />
            </ListItemButton>
          </ListItem>
        </List>
      );
    }
    return <List />;
  };
  const isAIDetectAvailable = React.useMemo(
    () =>
      drawObjectStateIdByAI && Object.keys(drawObjectStateIdByAI).length !== 0,
    [drawObjectStateIdByAI]
  );
  const [isShowAllAIDetect, setIsShowAllAIDetect] = React.useState(false);
  const handleClickShowAllAIDetect = () => {
    setIsShowAllAIDetect(!isShowAllAIDetect);
    if (isShowAllAIDetect) {
      dispatch(hiddenAllDrawObjectStateIdByAI());
    } else {
      dispatch(showAllDrawObjectStateIdByAI());
    }
  };
  const onClickGoBack = () => {
    if (
      savedCurrentAnnotationProjectName &&
      savedCurrentAnnotationProjectName.current
    ) {
      history.push(
        `/annotation/project/${savedCurrentAnnotationProjectName.current}`
      );
    } else {
      history.goBack();
    }
  };
  const isSelected =
    currentDrawState === DrawState.SELECTING ||
    currentDrawState === DrawState.DRAGGING ||
    currentDrawState === DrawState.TRANSFORMING;
  return (
    <Box sx={{ minWidth: 100 }} display="flex" flexDirection="column" gap={1}>
      <Button
        sx={{ alignSelf: "flex-start" }}
        color="info"
        variant="text"
        onClick={onClickGoBack}
        startIcon={<ArrowBackIcon />}
      >
        <Typography
          color="text.primary"
          fontSize={14}
          fontWeight="medium"
          textTransform="initial"
        >
          Back
        </Typography>
      </Button>
      <ToggleButtonGroup
        value={currentDrawState}
        exclusive
        aria-label="mode"
        className="annotationControlPanel"
        size="large"
        sx={{ border: "1px dashed grey" }}
        onChange={handleSelectDrawState}
      >
        <TooltipToggleButton
          TooltipProps={{ title: `Select (${SELECT_SHORT_KEY})` }}
          value={DrawState.SELECTING}
          className="annotationBtn"
          selected={isSelected}
          aria-label="selecting"
        >
          <NearMeIcon />
        </TooltipToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={currentDrawType}
        exclusive
        onChange={selectModeHandle}
        aria-label="mode"
        className="annotationControlPanel"
        size="large"
        sx={{ border: "1px dashed grey" }}
      >
        <TooltipToggleButton
          TooltipProps={{ title: `Rectangle (${DRAW_RECTANGLE_SHORT_KEY})` }}
          className="annotationBtn"
          value={DrawType.RECTANGLE}
          aria-label="Rectangle"
        >
          <Crop32Icon />
        </TooltipToggleButton>
        <TooltipToggleButton
          TooltipProps={{ title: `Polygon (${DRAW_POLYGON_SHORT_KEY})` }}
          className="annotationBtn"
          value={DrawType.POLYGON}
          aria-label="Polygon"
        >
          <HexagonIcon />
        </TooltipToggleButton>

        <TooltipToggleButton
          TooltipProps={{ title: `Ellipse (${DRAW_ELLIPSE_SHORT_KEY})` }}
          className="annotationBtn"
          value={DrawType.ELLIPSE}
          aria-label="ellipse"
        >
          <PanoramaFishEyeIcon />
        </TooltipToggleButton>
        <TooltipToggleButton
          TooltipProps={{ title: `Line (${DRAW_LINE_SHORT_KEY})` }}
          className="annotationBtn"
          value={DrawType.LINE_STRIP}
          aria-label="line"
        >
          <PolylineIcon />
        </TooltipToggleButton>
      </ToggleButtonGroup>
      <Box
        display="flex"
        mt={3}
        sx={{ border: "1px dashed grey" }}
        justifyContent="space-evenly"
        flexDirection="column"
        gap={2}
        pt={2}
        pb={1}
      >
        <Box display="flex" justifyContent="center">
          <Tooltip
            title={
              isAIDetectAvailable
                ? `AI Detection (${DRAW_SEGMENTATION_SHORT_KEY})`
                : "Don't have any detected object by AI"
            }
          >
            <span>
              <Badge
                badgeContent={
                  !isAIDetectAvailable ? (
                    <WarningAmberIcon
                      sx={{ color: "warning.light" }}
                      fontSize="small"
                    />
                  ) : undefined
                }
              >
                <IconButton
                  sx={{
                    border: "2px solid !important",
                    borderColor:
                      currentDrawType === DrawType.DETECTED_RECTANGLE
                        ? "#d7d7db !important"
                        : "",
                    borderRadius: "4px",
                  }}
                  onClick={(e) =>
                    selectModeHandle(e, DrawType.DETECTED_RECTANGLE)
                  }
                  disabled={!isAIDetectAvailable}
                >
                  <ImageSearchIcon fontSize="large" />
                </IconButton>
              </Badge>
            </span>
          </Tooltip>
        </Box>
        {isAIDetectAvailable && (
          <Box display="flex" justifyContent="center" alignItems="center">
            Segmentations
            <IconButton onClick={handleClickShowAllAIDetect}>
              {isShowAllAIDetect ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        mt={3}
        sx={{ border: "1px dashed grey" }}
        justifyContent="space-evenly"
      >
        <Tooltip title="Ctrl+Z">
          <span>
            <IconButton
              onClick={handleUndoDrawObject}
              disabled={annotationStatehHistory.historyStep === 0}
            >
              <UndoIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Ctrl+Shift+Z">
          <span>
            <IconButton
              onClick={handleRedoDrawObject}
              disabled={
                annotationStatehHistory.historyStep >=
                annotationStatehHistory.stateHistoryItems.length - 1
              }
            >
              <RedoIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Button
        variant="outlined"
        onClick={resetScaleHandler}
        sx={{ marginTop: 3 }}
      >
        Reset Scale
      </Button>
      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          color="warning"
          // onClick={importHander}
          id="import"
          onClick={handleClickExport}
        >
          Import
        </Button>
        <Button variant="contained" onClick={handleClickExport} id="export">
          Export
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {renderPopupContent()}
        </Popover>
      </Box>
      <Box display="flex" flex={1} justifyContent="center">
        <LoadingButton
          onClick={handleSaveAnnotation}
          endIcon={<SaveIcon />}
          loading={isSavingAnnotation}
          loadingPosition="end"
          variant="contained"
          color="success"
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
}
export default ControlPanel;
