import Crop32Icon from "@mui/icons-material/Crop32";
import HexagonIcon from "@mui/icons-material/Hexagon";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
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
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawType,
  changeZoom,
  redoDrawObject,
  resetCurrentStateDrawObject,
  undoDrawObject,
} from "reduxes/annotation/action";
import {
  selectorAnnotationStatehHistory,
  selectorcurrentDrawType,
  selectorDrawObjectById,
} from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";
import {
  addImagesToAnnotation,
  changePreviewImage,
  saveAnnotationStateManager,
} from "reduxes/annotationmanager/action";
import {
  selectorCurrentAnnotationFile,
  selectorIdDrawObjectByImageName,
} from "reduxes/annotationmanager/selecetor";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { exportAnnotation } from "components/Annotation/Formart/labelme";
import {
  exportAnnotationLabelBox,
  exportAnnotationLabelMe,
  exportAnnotationScaleAI,
  importAnnotationLabelMe,
} from "components/Annotation/Formart";

const ControlPanel = () => {
  const dispatch = useDispatch();
  const currentDrawType = useSelector(selectorcurrentDrawType);
  const drawObjectById = useSelector(selectorDrawObjectById);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const idDrawObjectByImageName = useSelector(selectorIdDrawObjectByImageName);
  const annotationStatehHistory = useSelector(selectorAnnotationStatehHistory);
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
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      for (const acceptedFile of acceptedFiles) {
        importAnnotationLabelMe(acceptedFile).then((resp) => {
          const { annotationImagesProperty, drawObjectById } = resp;

          dispatch(
            addImagesToAnnotation({
              annotationImagesProperties: [annotationImagesProperty],
            })
          );
          dispatch(
            saveAnnotationStateManager({
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
            changePreviewImage({
              imageName: annotationImagesProperty.image.name,
            })
          );
        });
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClickExport = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

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
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            Import
          </Button>
          <Button variant="contained" onClick={handleClickExport}>
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
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary="Labelme"
                    onClick={handleExportLabelMe}
                  />
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
            </List>
          </Popover>
        </Box>
      </Box>
    </>
  );
};
export default ControlPanel;
