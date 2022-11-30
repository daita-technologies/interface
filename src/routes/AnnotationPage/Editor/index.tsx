import Box from "@mui/material/Box";
import {
  getFitScaleEditor,
  getNewPositionOnWheel,
} from "components/Annotation/Editor/utils";
import { KonvaEventObject } from "konva/lib/Node";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";

import { CircularProgress, Typography } from "@mui/material";
import { Ellipse, Polygon, Rectangle } from "components/Annotation";
import {
  MAX_HEIGHT_EDITOR,
  MAX_WIDTH_EDITOR,
} from "components/Annotation/Editor/const";
import Konva from "konva";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import {
  changeCurrentDrawState,
  changeCurrentDrawType,
  changeZoom,
  deleteDrawObject,
  recoverPreviousDrawState,
  redoDrawObject,
  setIsDraggingViewpor,
  setKeyDownInEditor,
  setSelectedShape,
  undoDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorCurrentDrawType,
  selectorDrawObjectById,
  selectorIsDraggingViewport,
  selectorSelectedDrawObjectId,
  selectorZoom,
} from "reduxes/annotation/selector";
import { DrawObject, DrawState, DrawType } from "reduxes/annotation/type";
import {
  selectorCurrentAnnotationFile,
  selectorCurrentImageInEditorProps,
  selectorIsFetchingImageData,
} from "reduxes/annotationmanager/selector";
import {
  DRAW_ELLIPSE_SHORT_KEY,
  DRAW_LINE_SHORT_KEY,
  DRAW_POLYGON_SHORT_KEY,
  DRAW_RECTANGLE_SHORT_KEY,
  DRAW_SEGMENTATION_SHORT_KEY,
  SELECT_SHORT_KEY,
} from "../constants";
import BaseImage from "./BaseImage";
import DrawLayer from "./Layer/DrawLayer";

const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 40;

function Editor() {
  const dispatch = useDispatch();
  const layer = useRef<Konva.Layer | null>(null);
  const group = useRef<Konva.Group | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [keyDown, setKeyDown] = useState<string | null>();
  const refBoundDiv = useRef<HTMLDivElement | null>(null);
  const refTextPosition = useRef<Konva.Text | null>(null);

  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const isFetchingImageData = useSelector(selectorIsFetchingImageData);
  const drawObjectById = useSelector(selectorDrawObjectById);
  const selectedDrawObjectId = useSelector(selectorSelectedDrawObjectId);
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const currentDrawType = useSelector(selectorCurrentDrawType);

  const zoom = useSelector(selectorZoom);
  const isDraggingViewport = useSelector(selectorIsDraggingViewport);

  const toolTipLayer = useRef<Konva.Layer>(null);
  const toolTip = useRef<Konva.Text>(null);
  const toolTipRect = useRef<Konva.Rect>(null);
  const currentImageInEditorProps = useSelector(
    selectorCurrentImageInEditorProps
  );

  const drawObjects = useMemo(() => {
    const rectanglesById: Record<string, DrawObject> = {};
    const polygonsById: Record<string, DrawObject> = {};
    const ellipsesById: Record<string, DrawObject> = {};
    const linestripsById: Record<string, DrawObject> = {};

    Object.keys(drawObjectById).forEach((t) => {
      if (drawObjectById[t].type === DrawType.RECTANGLE) {
        rectanglesById[t] = drawObjectById[t];
      } else if (drawObjectById[t].type === DrawType.POLYGON) {
        polygonsById[t] = drawObjectById[t];
      } else if (drawObjectById[t].type === DrawType.ELLIPSE) {
        ellipsesById[t] = drawObjectById[t];
      } else if (drawObjectById[t].type === DrawType.LINE_STRIP) {
        linestripsById[t] = drawObjectById[t];
      }
    });
    return {
      rectangles: rectanglesById,
      polygons: polygonsById,
      ellipses: ellipsesById,
      linestrips: linestripsById,
    };
  }, [drawObjectById]);
  const polygons = useMemo(
    () => ({
      ...drawObjects.polygons,
      ...drawObjects.linestrips,
    }),
    [drawObjects.polygons]
  );
  const refZoom = stageRef;

  const wheelHandler = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    if (
      !refZoom?.current ||
      !e.evt.ctrlKey ||
      !stageRef?.current ||
      !stageRef.current.getPointerPosition()
    ) {
      return;
    }

    const points = stageRef.current.getPointerPosition();
    if (points) {
      const { newPosition, newScale } = getNewPositionOnWheel(
        e,
        refZoom.current,
        points
      );
      if (currentAnnotationFile) {
        const { height, width } = currentAnnotationFile;
        const fitScaleEditor = getFitScaleEditor(width, height);
        if (newScale <= fitScaleEditor) return;
      }
      dispatch(changeZoom({ zoom: { zoom: newScale, position: newPosition } }));
    }
  };
  useEffect(() => {
    if (refZoom && refZoom.current) {
      refZoom.current.scale({ x: zoom.zoom, y: zoom.zoom });
      refZoom.current.position(zoom.position);
    }
  }, [zoom]);

  const keyUpHandler = (): void => {
    setKeyDown(null);
    dispatch(setKeyDownInEditor({ keyDownInEditor: null }));
    if (currentDrawState === DrawState.ZOOMDRAGGING) {
      dispatch(recoverPreviousDrawState());
    }
  };
  const keyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (e.key === "Z" || e.key === "z")
    ) {
      dispatch(redoDrawObject());
    } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      dispatch(undoDrawObject());
    } else if (e.key === " ") {
      setKeyDown(e.key);
      if (currentDrawState !== DrawState.ZOOMDRAGGING) {
        dispatch(changeCurrentDrawState({ drawState: DrawState.ZOOMDRAGGING }));
      }
    } else if (e.key === "Delete" || e.key === "Backspace") {
      if (selectedDrawObjectId) {
        dispatch(deleteDrawObject({ drawObjectId: selectedDrawObjectId }));
        if (toolTipLayer.current?.attrs.id === selectedDrawObjectId) {
          toolTipLayer.current.hide();
        }
      }
    } else if (e.key === "Escape") {
      dispatch(setKeyDownInEditor({ keyDownInEditor: e.key }));
    }
    if (
      currentDrawState === null ||
      currentDrawState === DrawState.FREE ||
      currentDrawState === DrawState.SELECTING
    ) {
      if (e.key === SELECT_SHORT_KEY) {
        dispatch(changeCurrentDrawState({ drawState: DrawState.SELECTING }));
        dispatch(changeCurrentDrawType({ currentDrawType: null }));
      } else if (e.key === DRAW_RECTANGLE_SHORT_KEY) {
        dispatch(
          changeCurrentDrawType({ currentDrawType: DrawType.RECTANGLE })
        );
        dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
      } else if (e.key === DRAW_POLYGON_SHORT_KEY) {
        dispatch(changeCurrentDrawType({ currentDrawType: DrawType.POLYGON }));
        dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
      } else if (e.key === DRAW_ELLIPSE_SHORT_KEY) {
        dispatch(changeCurrentDrawType({ currentDrawType: DrawType.ELLIPSE }));
        dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
      } else if (e.key === DRAW_LINE_SHORT_KEY) {
        dispatch(
          changeCurrentDrawType({ currentDrawType: DrawType.LINE_STRIP })
        );
        dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
      } else if (e.key === DRAW_SEGMENTATION_SHORT_KEY) {
        dispatch(
          changeCurrentDrawType({
            currentDrawType: DrawType.DETECTED_RECTANGLE,
          })
        );
        dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
      }
    }
  };

  useEffect(() => {
    if (keyDown === " ") {
      dispatch(setIsDraggingViewpor({ isDraggingViewport: true }));
    } else if (isDraggingViewport === true) {
      dispatch(setIsDraggingViewpor({ isDraggingViewport: false }));
    }
  }, [keyDown]);
  const mouseOverBoundDivHandler = () => {
    refBoundDiv.current?.focus();
  };

  const onMouseOverToolTipHandler = (
    e: KonvaEventObject<MouseEvent>,
    id: string
  ) => {
    const drawObject = drawObjectById[id];
    if (!drawObject) {
      return;
    }
    const shape = drawObject.data;
    if (
      layer?.current &&
      toolTipLayer.current &&
      toolTip.current &&
      currentAnnotationFile
    ) {
      const mousePos = layer.current.getRelativePointerPosition();
      let disX = 5;
      let disY = 5;
      if (mousePos.x + TOOLTIP_WIDTH > currentAnnotationFile.width) {
        disX = -TOOLTIP_WIDTH * 2;
      }
      if (mousePos.y + 2 * TOOLTIP_HEIGHT > currentAnnotationFile.height) {
        disY = -TOOLTIP_HEIGHT * 2;
      }

      toolTipLayer.current.position({
        x: mousePos.x + disX,
        y: mousePos.y + disY,
      });
      toolTipLayer.current.setAttrs({ id: shape.id });
      toolTip.current.text(
        `${
          shape.label && shape.label.label !== ""
            ? shape.label.label
            : "No label"
        }`
      );
      toolTipLayer.current.show();
    }
  };
  const onMouseOutToolTipHandler = () => {
    if (layer?.current && toolTipLayer.current && toolTip.current) {
      toolTipLayer.current.hide();
    }
  };
  // const dragBoundFunc = (pos: Vector2d) => {
  //   if (!layer.current || !imageRef.current) {
  //     return { x: 0, y: 0 };
  //   }
  //   let { x, y } = pos;
  //   const sw = layer.current.width();
  //   const sh = layer.current.height();
  //   const box = imageRef.current.getClientRect();
  //   const minMaxX = [0, box.width];
  //   const minMaxY = [0, box.height];

  //   if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
  //   if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
  //   if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
  //   if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
  //   return { x, y };
  // };
  useEffect(() => {
    if (zoom.zoom === 1) {
      group.current?.setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);
  const isLoading = useMemo(() => {
    if (!currentAnnotationFile || isFetchingImageData === true) {
      return true;
    }
    return currentAnnotationFile.image === null;
  }, [currentAnnotationFile, isFetchingImageData]);
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    dispatch(setSelectedShape({ selectedDrawObjectId: null }));
    e.evt.preventDefault();
    e.evt.stopPropagation();
  };
  const selectHandleMouseDown = useMemo(() => {
    if (currentDrawState !== DrawState.SELECTING && currentDrawType !== null) {
      return undefined;
    }
    return handleMouseDown;
  }, [currentDrawState, currentDrawType]);
  const renderContent = () => {
    if (isLoading || !currentImageInEditorProps) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={24} />
          <Typography
            mt={1}
            color="text.secondary"
            variant="body2"
            fontStyle="italic"
          >
            Fetching image and segmentation information...
          </Typography>
        </Box>
      );
    }
    return (
      <Box
        ref={refBoundDiv}
        tabIndex={0}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
        onMouseOver={mouseOverBoundDivHandler}
        id="annotation-editor-bound"
        width="100%"
        height="100%"
        sx={{ outline: "none" }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <ReactReduxContext.Consumer>
            {({ store }) => (
              <Stage
                ref={stageRef}
                scaleX={currentImageInEditorProps.scaleX}
                scaleY={currentImageInEditorProps.scaleY}
                width={MAX_WIDTH_EDITOR}
                height={MAX_HEIGHT_EDITOR}
                onWheel={wheelHandler}
                onClick={selectHandleMouseDown}
                draggable={isDraggingViewport}
              >
                <Provider store={store}>
                  <DrawLayer
                    paddingLeft={currentImageInEditorProps.paddingLeft}
                    paddingTop={currentImageInEditorProps.paddingTop}
                  />
                  <Layer
                    ref={layer}
                    x={currentImageInEditorProps.paddingLeft}
                    y={currentImageInEditorProps.paddingTop}
                  >
                    <BaseImage />
                    <Group
                      ref={group}
                      // dragBoundFunc={dragBoundFunc}
                    >
                      {Object.keys(drawObjects.rectangles).map((key) => (
                        <Rectangle
                          key={key}
                          id={key}
                          onMouseOverHandler={(e) =>
                            onMouseOverToolTipHandler(e, key)
                          }
                          onMouseOutHandler={onMouseOutToolTipHandler}
                        />
                      ))}
                      {Object.keys(drawObjects.ellipses).map((key) => (
                        <Ellipse
                          key={key}
                          id={key}
                          onMouseOverHandler={(e) =>
                            onMouseOverToolTipHandler(e, key)
                          }
                          onMouseOutHandler={onMouseOutToolTipHandler}
                        />
                      ))}
                      {Object.keys(polygons).map((key) => (
                        <Polygon
                          key={key}
                          id={key}
                          onMouseOverHandler={(e) => {
                            onMouseOverToolTipHandler(e, key);
                          }}
                          onMouseOutHandler={onMouseOutToolTipHandler}
                        />
                      ))}
                    </Group>
                  </Layer>
                  <Layer
                    ref={toolTipLayer}
                    visible={false}
                    scaleX={
                      currentImageInEditorProps
                        ? 1 / currentImageInEditorProps.scaleX
                        : 1
                    }
                    scaleY={
                      currentImageInEditorProps
                        ? 1 / currentImageInEditorProps.scaleY
                        : 1
                    }
                  >
                    <Rect
                      ref={toolTipRect}
                      x={0}
                      y={0}
                      stroke="#555"
                      strokeWidth={2}
                      fill="#ddd"
                      width={TOOLTIP_WIDTH}
                      height={TOOLTIP_HEIGHT}
                    />
                    <Text
                      align="center"
                      width={TOOLTIP_WIDTH}
                      height={TOOLTIP_HEIGHT}
                      fontSize={15}
                      padding={14}
                      ref={toolTip}
                    />
                  </Layer>
                  <Layer>
                    <Text
                      ref={refTextPosition}
                      x={10}
                      y={10}
                      fontFamily="Calibri"
                      fontSize={34}
                      text=""
                      fill="black"
                    />
                  </Layer>
                </Provider>
              </Stage>
            )}
          </ReactReduxContext.Consumer>
        </Box>
      </Box>
    );
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      width="100%"
      height="100%"
      margin="auto"
      flexWrap="wrap"
    >
      {renderContent()}
    </Box>
  );
}

export default Editor;
