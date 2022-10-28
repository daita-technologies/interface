import Crop32Icon from "@mui/icons-material/Crop32";
import HexagonIcon from "@mui/icons-material/Hexagon";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CssStyle } from "components/Annotation/Editor/type";
import {
  exportAnnotationDaita,
  exportAnnotationLabelBox,
  exportAnnotationLabelMe,
  exportAnnotationScaleAI,
  importAnnotationLabelMe,
  importAnnotationScaleAI,
  importFileAnnotationDaita,
} from "components/Annotation/Formart";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawType,
  changeZoom,
  createDrawObject,
  redoDrawObject,
  resetCurrentStateDrawObject,
  undoDrawObject,
} from "reduxes/annotation/action";
import {
  selectorAnnotationStatehHistory,
  selectorcurrentDrawType,
  selectorDrawObjectById,
} from "reduxes/annotation/selector";
import { DrawObject, DrawType } from "reduxes/annotation/type";
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
import { hashCode, intToRGB } from "../LabelAnnotation";
import { convertStrokeColorToFillColor } from "../LabelAnnotation/ClassLabel";

const ControlPanel = () => {
  const dispatch = useDispatch();
  const currentDrawType = useSelector(selectorcurrentDrawType);
  const drawObjectById = useSelector(selectorDrawObjectById);
  const currentPreviewImageName = useSelector(selectorCurrentPreviewImageName);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const isSavingAnnotation = useSelector(selectorIsSavingAnnotation);
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

  const resetScaleHandler = () => {
    dispatch(changeZoom({ zoom: { zoom: 1, position: { x: 0, y: 0 } } }));
  };

  const selectModeHandle = (
    event: React.MouseEvent<HTMLElement>,
    drawType: DrawType
  ) => {
    dispatch(changeCurrentDrawType({ currentDrawType: drawType }));
  };
  const handleExportLabelMe = () => {
    if (currentAnnotationFile && drawObjectById) {
      exportAnnotationLabelMe(currentAnnotationFile, drawObjectById);
    }
  };
  const handleExportScaleAI = () => {
    if (drawObjectById) {
      exportAnnotationScaleAI(drawObjectById);
    }
  };
  const handleExportLabelBox = () => {
    if (drawObjectById) {
      exportAnnotationLabelBox(drawObjectById);
    }
  };
  const handleExportDaita = () => {
    if (drawObjectById) {
      exportAnnotationDaita(
        drawObjectById,
        currentPreviewImageName ? currentPreviewImageName : "imagename"
      );
    }
  };
  const updateDrawObject = (value: DrawObject) => {
    const drawObjectRet: DrawObject = { ...value };
    const label = value.data.label.label;
    let classLabel = labelClassPropertiesByLabelClass[label];
    if (!classLabel) {
      const strokeColor = "#" + intToRGB(hashCode(label));
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
    const { annotationImagesProperty, drawObjectById } =
      await importAnnotationLabelMe(acceptedFile);
    Object.entries(drawObjectById).map(([key, value]) => {
      drawObjectById[key] = updateDrawObject(value);
    });
    dispatch(
      addImagesToAnnotation({
        annotationImagesProperties: [annotationImagesProperty],
      })
    );
    dispatch(
      setAnnotationStateManager({
        imageName: annotationImagesProperty.image.name,
        drawObjectById: drawObjectById,
      })
    );

    dispatch(
      resetCurrentStateDrawObject({
        drawObjectById: drawObjectById,
      })
    );
    dispatch(
      setPreviewImage({
        imageName: annotationImagesProperty.image.name,
      })
    );
  };
  const importDaita = async (acceptedFile: File) => {
    const { annotationImagesProperty, drawObjectById } =
      await importFileAnnotationDaita(acceptedFile);
    Object.entries(drawObjectById).map(([key, value]) => {
      drawObjectById[key] = updateDrawObject(value);
    });
    dispatch(
      addImagesToAnnotation({
        annotationImagesProperties: [annotationImagesProperty],
      })
    );
    dispatch(
      setAnnotationStateManager({
        imageName: annotationImagesProperty.image.name,
        drawObjectById: drawObjectById,
      })
    );

    dispatch(
      resetCurrentStateDrawObject({
        drawObjectById: drawObjectById,
      })
    );
    dispatch(
      setPreviewImage({
        imageName: annotationImagesProperty.image.name,
      })
    );
  };
  const importScaleAI = async (acceptedFile: File) => {
    const { drawObjectById } = await importAnnotationScaleAI(acceptedFile);
    // dispatch(
    //   resetCurrentStateDrawObject({
    //     drawObjectById: drawObjectById,
    //   })
    // );
    Object.entries(drawObjectById).map(([key, value]) => {
      drawObjectById[key] = updateDrawObject(value);
      dispatch(
        createDrawObject({
          drawObject: drawObjectById[key],
        })
      );
    });
  };
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const snapImportType = importType;
      for (const acceptedFile of acceptedFiles) {
        if (snapImportType === "LABEL_ME") {
          importLabelMe(acceptedFile);
        } else if (snapImportType === "SCALE_AI") {
          importScaleAI(acceptedFile);
        } else if (snapImportType === "DAITA") {
          importDaita(acceptedFile);
        }
      }
    }
  };
  const dropZone = useDropzone({
    onDrop,
    accept: ".json",
    noDragEventsBubbling: true,
  });
  const { getRootProps, isDragActive, getInputProps } = dropZone;
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
    } else if (anchorEl?.id === "export") {
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
  };
  return (
    <>
      <Box sx={{ minWidth: 100 }} display="flex" flexDirection="column" gap={1}>
        <ToggleButtonGroup
          value={currentDrawType}
          exclusive
          onChange={selectModeHandle}
          aria-label="mode"
          className="annotationControlPanel"
          size="large"
          sx={{ border: "1px dashed grey" }}
        >
          <ToggleButton
            className="annotationBtn"
            value={DrawType.RECTANGLE}
            aria-label="Rectangle"
          >
            <Crop32Icon />
          </ToggleButton>
          <ToggleButton
            className="annotationBtn"
            value={DrawType.POLYGON}
            aria-label="Polygon"
          >
            <HexagonIcon />
          </ToggleButton>
          <ToggleButton
            className="annotationBtn"
            value={DrawType.ELLIPSE}
            aria-label="ellipse"
          >
            <PanoramaFishEyeIcon />
          </ToggleButton>
          <ToggleButton
            className="annotationBtn"
            value={DrawType.LINE_STRIP}
            aria-label="ellipse"
          >
            <PolylineIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <Box
          display="flex"
          mt={3}
          sx={{ border: "1px dashed grey" }}
          justifyContent="space-evenly"
        >
          <Tooltip title="AI Detection">
            <span>
              <IconButton
                onClick={(e) =>
                  selectModeHandle(e, DrawType.DETECTED_RECTANGLE)
                }
              >
                <ImageSearchIcon fontSize="large" />
              </IconButton>
            </span>
          </Tooltip>
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
                disabled={annotationStatehHistory.historyStep == 0}
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
    </>
  );
};
export default ControlPanel;
