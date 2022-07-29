import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import React, { useMemo, useState } from "react";
import { Rect, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentStatus,
  setSelectedShape,
  updateDrawObject,
} from "reduxes/annotation/action";
import { selectorSelectedRectangle } from "reduxes/annotation/selector";
import { DrawState } from "reduxes/annotation/type";
import { CIRCLE_STYLE, CORNER_RADIUS } from "../const";
import { RectangleProps, RectangleSpec } from "../type";

const Rectangle = function ({
  rectangleSpec,
  onMouseOverHandler,
  onMouseOutHandler,
}: RectangleProps) {
  const shapeRef = React.useRef<Konva.Rect>(null);
  const trRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  const currentRectangle = useSelector(selectorSelectedRectangle);

  const isSelected = useMemo(() => {
    return currentRectangle != null && rectangleSpec.id === currentRectangle.id;
  }, [currentRectangle?.id]);
  const onChange = (rect: RectangleSpec) => {
    dispatch(
      updateDrawObject({
        data: { ...rect },
      })
    );
  };
  React.useEffect(() => {
    if (isSelected) {
      if (!trRef.current) return;
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  const [stage, setStage] = useState<Konva.Stage | null>(null);

  const groupDragBound = (pos: Vector2d) => {
    let { x, y } = pos;
    const sw = stage ? stage.width() : 0;
    const sh = stage ? stage.height() : 0;
    if (shapeRef && shapeRef.current) {
      const box = shapeRef.current.getClientRect();
      const minMaxX = [0, box.width];
      const minMaxY = [0, box.height];

      if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
      if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
      if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
      if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
      return { x, y };
    }
    return { x: 0, y: 0 };
  };
  const onSelect = (e: KonvaEventObject<MouseEvent>) => {
    dispatch(setSelectedShape({ selectedShapeId: rectangleSpec.id }));
    e.cancelBubble = true;
  };
  const handleTransformStart = (e: KonvaEventObject<MouseEvent>) => {
    dispatch(
      changeCurrentStatus({
        drawState: DrawState.TRANSFORMING,
      })
    );
    e.cancelBubble = true;
  };
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    dispatch(
      changeCurrentStatus({
        drawState: DrawState.FREE,
      })
    );
    e.cancelBubble = true;
  };
  const dragStartHandle = (e: KonvaEventObject<DragEvent>) => {
    setStage(e.target.getStage());
    dispatch(
      changeCurrentStatus({
        drawState: DrawState.DRAGGING,
      })
    );
    e.cancelBubble = true;
  };
  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        dragBoundFunc={groupDragBound}
        onClick={onSelect}
        onMouseDown={onSelect}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        {...rectangleSpec}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...rectangleSpec,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDragStart={dragStartHandle}
        onTransformStart={handleTransformStart}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...rectangleSpec,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
          handleTransformEnd(e);
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorFill={CIRCLE_STYLE.fill}
          anchorCornerRadius={CORNER_RADIUS}
          anchorStrokeWidth={CIRCLE_STYLE.strokeWidth}
          anchorStroke={CIRCLE_STYLE.stroke}
          anchorSize={CORNER_RADIUS * 1.8}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
export default Rectangle;
