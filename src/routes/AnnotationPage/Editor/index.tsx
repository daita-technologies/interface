import Box from "@mui/material/Box";
import {
  getFitScaleEditor,
  getNewPositionOnWheel,
} from "components/Annotation/Editor/utils";
import { KonvaEventObject } from "konva/lib/Node";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";

import { CircularProgress } from "@mui/material";
import { Ellipse, Polygon, Rectangle } from "components/Annotation";
import {
  MAX_HEIGHT_IMAGE_IN_EDITOR,
  MAX_WIDTH_IMAGE_IN_EDITOR,
} from "components/Annotation/Editor/const";
import { PolygonSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import {
  changeCurrentStatus,
  changeZoom,
  deleteDrawObject,
  redoDrawObject,
  setIsDraggingViewpor,
  undoDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorDrawObjectById,
  selectorIsDraggingViewport,
  selectorSelectedDrawObjectId,
  selectorZoom,
} from "reduxes/annotation/selector";
import { DrawObject, DrawState, DrawType } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";
import BaseImage from "./BaseImage";
import DrawLayer from "./Layer/DrawLayer";

const Editor = () => {
  const dispatch = useDispatch();
  const imageRef = useRef<Konva.Image | null>(null);
  const layer = useRef<Konva.Layer | null>(null);
  const group = useRef<Konva.Group | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [keyDown, setKeyDown] = useState<string | null>();
  const refBoundDiv = useRef<HTMLDivElement | null>(null);
  const refTextPosition = useRef<Konva.Text | null>(null);

  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const drawObjectById = useSelector(selectorDrawObjectById);
  const selectedDrawObjectId = useSelector(selectorSelectedDrawObjectId);
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const zoom = useSelector(selectorZoom);
  const isDraggingViewport = useSelector(selectorIsDraggingViewport);

  const toolTipLayer = useRef<Konva.Layer>(null);
  const toolTip = useRef<Konva.Text>(null);
  const toolTipRect = useRef<Konva.Rect>(null);
  const stageProps = useMemo(() => {
    if (currentAnnotationFile) {
      const { height, width } = currentAnnotationFile;
      const widthRatio = MAX_WIDTH_IMAGE_IN_EDITOR / width;
      const heightRatio = MAX_HEIGHT_IMAGE_IN_EDITOR / height;
      let newWidth = width;
      let newHeight = height;
      if (widthRatio < 1 || heightRatio < 1) {
        if (widthRatio < heightRatio) {
          newWidth = MAX_WIDTH_IMAGE_IN_EDITOR;
          newHeight = newHeight * widthRatio;
        } else {
          newHeight = MAX_HEIGHT_IMAGE_IN_EDITOR;
          newWidth = newWidth * heightRatio;
        }
      }
      return {
        scaleX: newWidth / width,
        scaleY: newHeight / height,
        height: newHeight,
        width: newWidth,
      };
    }
    return null;
  }, [currentAnnotationFile]);

  // useEffect(() => {
  //   if (drawType === DrawType.DETECTED_RECTANGLE) {
  //     if (localDetectedArea && refDetectedArea.current) {
  //       dispatch(
  //         setDetectedArea({
  //           detectedArea: { ...refDetectedArea.current.getClientRect() },
  //         })
  //       );
  //     }
  //   }
  // }, [localDetectedArea]);
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
  const polygons = useMemo(() => {
    return {
      ...drawObjects.polygons,
      ...drawObjects.linestrips,
    };
  }, [drawObjects.polygons]);
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
        const zoom = getFitScaleEditor(width, height);
        if (newScale <= zoom) return;
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
    if (currentDrawState === DrawState.ZOOMDRAGGING) {
      dispatch(changeCurrentStatus({ drawState: DrawState.FREE }));
    }
  };
  const keyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.shiftKey && e.key == "Z") {
      dispatch(redoDrawObject());
    } else if (e.ctrlKey && e.key == "z") {
      dispatch(undoDrawObject());
    } else if (e.key === " ") {
      setKeyDown(e.key);
      if (currentDrawState !== DrawState.ZOOMDRAGGING) {
        dispatch(changeCurrentStatus({ drawState: DrawState.ZOOMDRAGGING }));
      }
    } else if (e.key === "Delete") {
      if (selectedDrawObjectId) {
        dispatch(deleteDrawObject({ drawObjectId: selectedDrawObjectId }));
        if (toolTipLayer.current?.attrs["id"] === selectedDrawObjectId) {
          toolTipLayer.current.hide();
        }
      }
    } else if (e.key === "Escape") {
      if (selectedDrawObjectId) {
        if (drawObjectById[selectedDrawObjectId].type === DrawType.POLYGON) {
          const polygon = drawObjectById[selectedDrawObjectId]
            .data as PolygonSpec;
          if (!polygon.polygonState.isFinished) {
            dispatch(deleteDrawObject({ drawObjectId: selectedDrawObjectId }));
          }
        }
      }
    }
  };

  useEffect(() => {
    if (keyDown === " ") {
      dispatch(setIsDraggingViewpor({ isDraggingViewport: true }));
    } else {
      if (isDraggingViewport === true) {
        dispatch(setIsDraggingViewpor({ isDraggingViewport: false }));
      }
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
    if (layer?.current && toolTipLayer.current && toolTip.current) {
      const mousePos = layer.current.getRelativePointerPosition();
      toolTipLayer.current.position({
        x: mousePos.x + 5,
        y: mousePos.y + 5,
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
  const dragBoundFunc = (pos: Vector2d) => {
    if (!layer.current || !imageRef.current) {
      return { x: 0, y: 0 };
    }
    let { x, y } = pos;
    const sw = layer.current.width();
    const sh = layer.current.height();
    const box = imageRef.current.getClientRect();
    const minMaxX = [0, box.width];
    const minMaxY = [0, box.height];

    if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
    if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
    return { x, y };
  };
  useEffect(() => {
    if (zoom.zoom === 1) {
      group.current?.setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);
  const isLoading = useMemo(() => {
    if (!currentAnnotationFile) {
      return true;
    }
    return currentAnnotationFile.image === null;
  }, [currentAnnotationFile]);
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignSelf="center">
          <CircularProgress size={24} />
        </Box>
      );
    } else {
      return (
        <Box
          ref={refBoundDiv}
          tabIndex={0}
          onKeyDown={keyDownHandler}
          onKeyUp={keyUpHandler}
          onMouseOver={mouseOverBoundDivHandler}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ReactReduxContext.Consumer>
            {({ store }) => (
              <Stage
                ref={stageRef}
                scaleX={stageProps ? stageProps.scaleX : 1}
                scaleY={stageProps ? stageProps.scaleY : 1}
                width={
                  stageProps ? stageProps.width : MAX_WIDTH_IMAGE_IN_EDITOR
                }
                height={
                  stageProps ? stageProps.height : MAX_HEIGHT_IMAGE_IN_EDITOR
                }
                onWheel={wheelHandler}
                draggable={isDraggingViewport}
              >
                <Provider store={store}>
                  <DrawLayer />
                  <Layer ref={layer}>
                    <BaseImage />
                    <Group
                      ref={group}
                      // dragBoundFunc={dragBoundFunc}
                    >
                      {Object.keys(drawObjects.rectangles).map((key) => {
                        return (
                          <Rectangle
                            key={key}
                            id={key}
                            onMouseOverHandler={(e) =>
                              onMouseOverToolTipHandler(e, key)
                            }
                            onMouseOutHandler={onMouseOutToolTipHandler}
                          />
                        );
                      })}
                      {Object.keys(drawObjects.ellipses).map((key) => {
                        return (
                          <Ellipse
                            key={key}
                            id={key}
                            onMouseOverHandler={(e) =>
                              onMouseOverToolTipHandler(e, key)
                            }
                            onMouseOutHandler={onMouseOutToolTipHandler}
                          />
                        );
                      })}
                      {Object.keys(polygons).map((key) => {
                        return (
                          <Polygon
                            key={key}
                            id={key}
                            onMouseOverHandler={(e) => {
                              onMouseOverToolTipHandler(e, key);
                            }}
                            onMouseOutHandler={onMouseOutToolTipHandler}
                          />
                        );
                      })}
                    </Group>
                  </Layer>
                  <Layer
                    ref={toolTipLayer}
                    visible={false}
                    scaleX={stageProps ? 1 / stageProps.scaleX : 1}
                    scaleY={stageProps ? 1 / stageProps.scaleY : 1}
                  >
                    <Rect
                      ref={toolTipRect}
                      x={0}
                      y={0}
                      stroke={"#555"}
                      strokeWidth={2}
                      fill={"#ddd"}
                      width={200}
                      height={40}
                    />
                    <Text
                      align="center"
                      width={200}
                      height={40}
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
                    ></Text>
                  </Layer>
                </Provider>
              </Stage>
            )}
          </ReactReduxContext.Consumer>
          {/* </div> */}
        </Box>
      );
    }
  };
  return (
    <>
      <Box sx={{ padding: "40px 20px" }}>
        <Box
          display="flex"
          justifyContent="center"
          width={MAX_WIDTH_IMAGE_IN_EDITOR}
          height={MAX_HEIGHT_IMAGE_IN_EDITOR}
          margin="auto"
        >
          {renderContent()}
        </Box>
      </Box>
    </>
  );
};

export default Editor;
