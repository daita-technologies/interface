import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import React, { useEffect, useMemo, useState } from "react";
import { Circle, Group, Line } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawState,
  setSelectedShape,
  updateDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorDrawObject,
  selectorDrawObjectState,
  selectorDrawObjectStateIdByAI,
  selectorSelectedPolygonOrLineStrip,
  selectorZoom,
} from "reduxes/annotation/selector";
import { DrawObject, DrawState, DrawType } from "reduxes/annotation/type";
import {
  CIRCLE_STYLE,
  CORNER_RADIUS,
  LINE_STYLE,
  STROKE_WIDTH_LINE,
} from "../const";
import { CssStyle, PolygonCompProps, PolygonProps, PolygonSpec } from "../type";
import useCommonShapeEvent from "../useCommonShapeEvent";
import { dragBoundFunc } from "../utils";

export const createPolygon = (
  position: Vector2d,
  isLineStrip?: boolean
): DrawObject => {
  const id = `POLYGON-${Math.floor(Math.random() * 100000)}`;
  const polygon: PolygonSpec = {
    id,
    points: [position],
    polygonState: { isFinished: false, isLineStrip },
    label: { label: id },
    cssStyle: { ...LINE_STYLE },
  };
  return { type: DrawType.POLYGON, data: polygon };
};

function PolygonComp({
  spec,
  onMouseOverHandler,
  onMouseOutHandler,
}: PolygonCompProps) {
  const {
    points,
    polygonState: { isFinished, isLineStrip },
  } = spec;
  const dispatch = useDispatch();
  const commonShapeEvent = useCommonShapeEvent({ drawObject: spec });
  const currentpolygon = useSelector(selectorSelectedPolygonOrLineStrip);
  // const detectedArea = useSelector(selectorDetectedArea);
  const drawObjectState = useSelector(selectorDrawObjectState(spec.id));
  const [lineStyle, setLineStyle] = useState<CssStyle>({
    ...spec.cssStyle,
    strokeWidth: STROKE_WIDTH_LINE,
  });
  const zoom = useSelector(selectorZoom);
  const groupRef = React.useRef<Konva.Group>(null);
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const drawObjectStateIdByAI = useSelector(selectorDrawObjectStateIdByAI);
  const isSelected = useMemo(
    () => currentpolygon != null && spec.id === currentpolygon.id,
    [currentpolygon?.id]
  );
  const position = useMemo(
    () =>
      currentpolygon != null && spec.id === currentpolygon.id
        ? currentpolygon.polygonState.mousePosition
        : null,
    [currentpolygon]
  );
  useEffect(() => {
    if (isSelected === true) {
      groupRef.current?.moveToTop();
    }
  }, [isSelected]);
  const [stage, setStage] = useState<Stage>();
  const [flattenedPoints, setFlattenedPoints] = useState<number[]>();
  const [mouseOverPoint, setMouseOverPoint] = useState(false);

  const handleGroupMouseOver = (e: any) => {
    if (!isFinished) {
      return;
    }
    onMouseOverHandler(e);
    e.target.getStage().container().style.cursor = "move";
    setStage(e.target.getStage());
  };
  useEffect(() => {
    const flatPoints: number[] = points
      .concat(isFinished || !position ? [] : position)
      .reduce((a, b) => a.concat([b.x, b.y]), [] as number[]);
    setFlattenedPoints(flatPoints);
  }, [points, isFinished, position]);
  const handleGroupMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    onMouseOutHandler(e);
  };
  const handleGroupDragStart = (e: KonvaEventObject<DragEvent>) => {
    if (groupRef.current) {
      dispatch(
        setSelectedShape({
          selectedDrawObjectId: spec.id,
        })
      );
      commonShapeEvent.handleDragStart(e);
    }
  };
  // const [previousPosition, setPreviousPosition] = useState<Vector2d>({
  //   x: 0,
  //   y: 0,
  // });
  // {
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // }

  // const groupDragBound = (pos: { x: number; y: number }) => {
  //   let { x, y } = pos;
  //   // console.log("pos", pos);
  //   const sw = stage ? stage.width() : 0;
  //   const sh = stage ? stage.height() : 0;
  //   if (groupRef && groupRef.current) {
  //     const box = groupRef.current.getClientRect();
  //     const relativePosition = groupRef.current.getRelativePointerPosition();
  //     console.log("box", box.y);
  //     const minMaxX = [0, box.width];
  //     const minMaxY = [0, box.height];
  //     // &&(currentBoudingBox === null ||     Math.round(box.y) !== Math.round(currentBoudingBox?.y))
  //     if (box.y <= 0) {
  //       x = previousPosition.x;
  //       y = previousPosition.y;
  //       console.log("assign x,y", x, y);
  //       // if (
  //       //   currentBoudingBox === null ||
  //       //   Math.round(box.y) <= Math.round(currentBoudingBox?.y)
  //       // ) {
  //       //   x = previousPosition.x;
  //       //   y = previousPosition.y;
  //       //   const tmp = {
  //       //     ...box,
  //       //     x: Math.round(box.x),
  //       //     y: Math.round(box.y),
  //       //   };
  //       //   setCurrentBoudingBox(tmp);
  //       //   console.log(
  //       //     "setCurrentBoudingBox",
  //       //     tmp,
  //       //     "box",
  //       //     box.y,
  //       //     "previos",
  //       //     previousPosition
  //       //   );
  //       // } else {
  //       //   console.log("ignore Dup position");
  //       // }
  //     } else {
  //       // if (
  //       //   currentBoudingBox &&
  //       //   Math.round(box.y) !== Math.round(currentBoudingBox?.y)
  //       // ) {
  //       //   setPreviousPosition({ x, y });
  //       // }
  //       // const tmp = {
  //       //   ...box,
  //       //   x: Math.round(box.x),
  //       //   y: Math.round(box.y),
  //       // };
  //       // setCurrentBoudingBox(tmp);
  //       if (box.y > 10) {
  //         setPreviousPosition({ x, y });
  //       }
  //     }
  //     if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
  //     if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
  //     if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
  //     return { x, y };
  //     // const box = groupRef.current.getClientRect();
  //     // const maxX = Math.max(...spec.points.map((t) => t.x));
  //     // const maxY = Math.max(...spec.points.map((t) => t.y));
  //     // console.log(minMaxX, minMaxY);
  //     // if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
  //     // if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
  //     // if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
  //     // if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
  //     // return { x, y };
  //   }
  //   return { x: 0, y: 0 };
  // };
  const handleMouseOverStartPoint = (e: KonvaEventObject<DragEvent>) => {
    if (isFinished || points.length < 3) return;
    e.target.scale({ x: 2, y: 2 });
    setMouseOverPoint(true);
  };
  const handleMouseOverStartPointLineStrip = (
    e: KonvaEventObject<DragEvent>
  ) => {
    if (isFinished || points.length < 2) return;
    e.target.scale({ x: 2, y: 2 });
    setMouseOverPoint(true);
  };
  const handleMouseOverStartPointWhenFinished = (
    e: KonvaEventObject<DragEvent>
  ) => {
    if (isFinished) {
      e.target.scale({ x: 2, y: 2 });
    }
  };
  const handleMouseOutStartPointWhenFinished = (
    e: KonvaEventObject<DragEvent>
  ) => {
    if (isFinished) {
      e.target.scale({ x: 1, y: 1 });
    }
  };
  const handleMouseOutStartPoint = (e: KonvaEventObject<DragEvent>) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handleMouseDownPoint = (e: KonvaEventObject<DragEvent>) => {
    if (mouseOverPoint && isSelected && currentpolygon) {
      currentpolygon.polygonState.isFinished = true;
      dispatch(
        updateDrawObject({
          data: currentpolygon,
        })
      );
      dispatch(
        changeCurrentDrawState({
          drawState: DrawState.SELECTING,
        })
      );
    }
    e.cancelBubble = true;
  };
  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    if (spec.polygonState.isFinished) {
      commonShapeEvent.handleSelect(e);
    }
  };
  const handleGroupDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const result: Vector2d[] = [];
    const x: number = e.target.x();
    const y: number = e.target.y();
    spec.points.map((point) => result.push({ x: point.x + x, y: point.y + y }));
    e.target.position({ x: 0, y: 0 });
    dispatch(
      updateDrawObject({
        data: {
          ...spec,
          points: result,
        },
      })
    );
    commonShapeEvent.handleDragEnd(e);
  };
  const converFlattenPointToPoint = (flatPoints: number[]) => {
    const newPoints: Vector2d[] = [];
    for (let index = 0; index < flatPoints.length; index += 2) {
      newPoints.push({ x: flatPoints[index], y: flatPoints[index + 1] });
    }
    return newPoints;
  };
  const handleTransformEnd = (e: KonvaEventObject<DragEvent>) => {
    dispatch(
      updateDrawObject({
        data: {
          ...spec,
          points: converFlattenPointToPoint(flattenedPoints as number[]),
        },
      })
    );
    commonShapeEvent.handleTransformEnd(e);
  };
  const handlePointDragMove = (e: KonvaEventObject<DragEvent>) => {
    const { points: specPoints } = spec;
    if (groupRef && groupRef.current) {
      const index = e.target.index - 1;
      const pos = {
        x: groupRef.current.getRelativePointerPosition().x,
        y: groupRef.current.getRelativePointerPosition().y,
      };
      const newPoints = [
        ...specPoints.slice(0, index),
        pos,
        ...specPoints.slice(index + 1),
      ];
      setFlattenedPoints(
        newPoints.reduce((a, b) => a.concat([b.x, b.y]), [] as number[])
      );
    }
  };
  const CORNER_RADIUS_AJUST_ZOOM = useMemo(
    () => CORNER_RADIUS / zoom.zoom,
    [zoom]
  );
  const dragBound = (pos: Vector2d) =>
    dragBoundFunc(
      stage ? stage.width() : 0,
      stage ? stage.height() : 0,
      CORNER_RADIUS_AJUST_ZOOM * 2,
      pos
    );
  const renderPoints = () =>
    points.map((point, index) => {
      const x = point.x - CORNER_RADIUS_AJUST_ZOOM / 2;
      const y = point.y - CORNER_RADIUS_AJUST_ZOOM / 2;
      let startPointAttr;
      if (spec.polygonState.isLineStrip === true) {
        startPointAttr =
          index === points.length - 1
            ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPointLineStrip,
                onMouseOut: handleMouseOutStartPoint,
                onMouseDown: handleMouseDownPoint,
              }
            : {
                onMouseOver: handleMouseOverStartPointWhenFinished,
                onMouseOut: handleMouseOutStartPointWhenFinished,
              };
      } else {
        startPointAttr =
          index === 0 && !isFinished
            ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
                onMouseDown: handleMouseDownPoint,
              }
            : {
                onMouseOver: handleMouseOverStartPointWhenFinished,
                onMouseOut: handleMouseOutStartPointWhenFinished,
              };
      }

      return (
        <Circle
          key={`${x}_${y}`}
          x={x}
          y={y}
          radius={CORNER_RADIUS_AJUST_ZOOM * 1.5}
          draggable
          onDragMove={handlePointDragMove}
          onDragStart={commonShapeEvent.handleTransformStart}
          onDragEnd={handleTransformEnd}
          dragBoundFunc={dragBound}
          {...CIRCLE_STYLE}
          {...startPointAttr}
        />
      );
    });
  const handleMouseDownLine = () => {
    if (currentDrawState !== DrawState.DRAWING) {
      setLineStyle({ ...lineStyle, strokeWidth: STROKE_WIDTH_LINE * 2 });
    }
  };
  const handleMouseOutLine = () => {
    setLineStyle({ ...lineStyle, strokeWidth: STROKE_WIDTH_LINE });
  };

  useEffect(() => {
    setLineStyle({ ...spec.cssStyle, strokeWidth: STROKE_WIDTH_LINE });
  }, [spec.cssStyle]);
  const isVisible = useMemo(() => {
    const isVis = drawObjectState ? !drawObjectState.isHidden : true;
    return (
      isVis &&
      (!drawObjectStateIdByAI[spec.id] ||
        drawObjectStateIdByAI[spec.id].isShow === true)
    );
  }, [drawObjectState, drawObjectStateIdByAI]);
  return (
    <Group
      ref={groupRef}
      draggable={isFinished && commonShapeEvent.isLock !== true}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
      // dragBoundFunc={groupDragBound}
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
      onMouseDown={mousedownHandler}
      onClick={commonShapeEvent.handleCick}
      visible={isVisible}
    >
      <Line
        points={flattenedPoints}
        closed={isFinished && isLineStrip !== true}
        onMouseOver={handleMouseDownLine}
        onMouseOut={handleMouseOutLine}
        {...lineStyle}
        strokeScaleEnabled={false}
      />
      {(isSelected || !isFinished) &&
        commonShapeEvent.isLock !== true &&
        points.length < 30 &&
        renderPoints()}
    </Group>
  );
}
function Polygon({ id, onMouseOverHandler, onMouseOutHandler }: PolygonProps) {
  const drawObject = useSelector(selectorDrawObject(id));
  if (drawObject) {
    return (
      <PolygonComp
        spec={drawObject.data as PolygonSpec}
        onMouseOutHandler={onMouseOutHandler}
        onMouseOverHandler={onMouseOverHandler}
      />
    );
  }
  return null;
}

export default Polygon;
