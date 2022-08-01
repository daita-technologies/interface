import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Circle, Group, Line } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentStatus,
  setSelectedShape,
  updateDrawObject,
} from "reduxes/annotation/action";
import { selectorSelectedPolygon } from "reduxes/annotation/selector";
import { DrawState } from "reduxes/annotation/type";
import { CIRCLE_STYLE, CORNER_RADIUS, LINE_STYLE } from "../const";
import { PolygonProps } from "../type";
import useCommonShapeEvent from "../useCommonShapeEvent";
import { dragBoundFunc, minMax } from "../utils";

const Polygon = ({
  spec,
  onMouseOverHandler,
  onMouseOutHandler,
}: PolygonProps) => {
  const {
    points,
    polygonState: { isFinished },
  } = spec;
  const dispatch = useDispatch();
  const commonShapeEvent = useCommonShapeEvent({ drawObject: spec });
  const currentpolygon = useSelector(selectorSelectedPolygon);
  const isSelected = useMemo(() => {
    return currentpolygon != null && spec.id === currentpolygon.id;
  }, [currentpolygon?.id]);
  const position = useMemo(() => {
    return currentpolygon != null && spec.id === currentpolygon.id
      ? currentpolygon.polygonState.mousePosition
      : null;
  }, [currentpolygon]);

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
  const [minMaxX, setMinMaxX] = useState([0, 0]);
  const [minMaxY, setMinMaxY] = useState([0, 0]);

  const handleGroupDragStart = (e: KonvaEventObject<DragEvent>) => {
    const arrX = points.map((p) => p.x);
    const arrY = points.map((p) => p.y);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
    dispatch(
      setSelectedShape({
        selectedDrawObjectId: spec.id,
      })
    );
    commonShapeEvent.handleDragStart(e);
  };
  const groupDragBound = (pos: { x: number; y: number }) => {
    let { x, y } = pos;
    const sw = stage ? stage.width() : 0;
    const sh = stage ? stage.height() : 0;
    if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
    if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
    return { x, y };
  };
  const handleMouseOverStartPoint = (e: KonvaEventObject<DragEvent>) => {
    if (isFinished || points.length < 3) return;
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
        changeCurrentStatus({
          drawState: DrawState.SELECTING,
        })
      );
    }
    e.cancelBubble = true;
  };
  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.target.getRelativePointerPosition();
    if (!position) return;
    if (spec.polygonState.isFinished) {
      commonShapeEvent.handleSelect(e);
      return;
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
  const handlePointDragMove = (e: KonvaEventObject<DragEvent>) => {
    const { points } = spec;
    const stage = e.target.getStage();
    if (stage) {
      const index = e.target.index - 1;
      const pos = { x: e.target._lastPos.x, y: e.target._lastPos.y };
      if (pos.x < 0) pos.x = 0;
      if (pos.y < 0) pos.y = 0;
      if (pos.x > stage.width()) pos.x = stage.width();
      if (pos.y > stage.height()) pos.y = stage.height();
      dispatch(
        updateDrawObject({
          data: {
            ...spec,
            points: [
              ...points.slice(0, index),
              pos,
              ...points.slice(index + 1),
            ],
          },
        })
      );
    }
  };
  const dragBound = (pos: Vector2d) =>
    dragBoundFunc(
      stage ? stage.width() : 0,
      stage ? stage.height() : 0,
      CORNER_RADIUS,
      pos
    );
  const renderPoints = () => {
    return points.map((point, index) => {
      const x = point.x - CORNER_RADIUS / 2;
      const y = point.y - CORNER_RADIUS / 2;
      const startPointAttr =
        index === 0
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
      return (
        <Circle
          key={index}
          x={x}
          y={y}
          radius={CORNER_RADIUS}
          draggable
          onDragMove={handlePointDragMove}
          onDragStart={commonShapeEvent.handleTransformStart}
          onDragEnd={commonShapeEvent.handleTransformEnd}
          dragBoundFunc={dragBound}
          {...CIRCLE_STYLE}
          {...startPointAttr}
        />
      );
    });
  };
  return (
    <Group
      draggable={isFinished}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
      dragBoundFunc={groupDragBound}
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
      onMouseDown={mousedownHandler}
      onClick={commonShapeEvent.handleCick}
    >
      <Line points={flattenedPoints} closed={isFinished} {...LINE_STYLE} />
      {(isSelected || !isFinished) && renderPoints()}
    </Group>
  );
};

export default Polygon;
