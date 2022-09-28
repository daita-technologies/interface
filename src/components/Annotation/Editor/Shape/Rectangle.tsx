import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Box } from "konva/lib/shapes/Transformer";
import { Vector2d } from "konva/lib/types";
import React, { useMemo, useState } from "react";
import { Rect, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { updateDrawObject } from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorDrawObjectState,
  selectorSelectedRectangle,
} from "reduxes/annotation/selector";
import { DrawState } from "reduxes/annotation/type";
import { CIRCLE_STYLE, CORNER_RADIUS } from "../const";
import { RectangleProps, RectangleSpec } from "../type";
import useCommonShapeEvent from "../useCommonShapeEvent";

const Rectangle = function ({
  spec,
  onMouseOverHandler,
  onMouseOutHandler,
}: RectangleProps) {
  const shapeRef = React.useRef<Konva.Rect>(null);
  const trRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  const currentRectangle = useSelector(selectorSelectedRectangle);
  const commonShapeEvent = useCommonShapeEvent({ drawObject: spec });
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const drawObjectState = useSelector(selectorDrawObjectState(spec.id));

  const [strokeWidth, setStrokeWidth] = useState<number>(
    spec.cssStyle.strokeWidth
  );

  const isSelected = useMemo(() => {
    return currentRectangle != null && spec.id === currentRectangle.id;
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

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    setStage(e.target.getStage());
    commonShapeEvent.handleDragStart(e);
  };
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...spec,
      x: e.target.x(),
      y: e.target.y(),
    });
    commonShapeEvent.handleDragEnd(e);
  };
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = shapeRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      ...spec,
      x: node.x(),
      y: node.y(),
      rotation: node.attrs.rotation,
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
    commonShapeEvent.handleTransformEnd(e);
  };
  const boundBoxFunc = (oldBox: Box, newBox: Box) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  };
  const onMouseOver = (e: KonvaEventObject<MouseEvent>) => {
    if (currentDrawState !== DrawState.DRAWING) {
      setStrokeWidth(spec.cssStyle.strokeWidth * 2);
    }
    onMouseOverHandler(e);
  };
  const onMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    setStrokeWidth(spec.cssStyle.strokeWidth);
    onMouseOutHandler(e);
  };

  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        dragBoundFunc={groupDragBound}
        onClick={commonShapeEvent.handleCick}
        onMouseDown={commonShapeEvent.handleSelect}
        onTransformStart={commonShapeEvent.handleTransformStart}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        draggable={commonShapeEvent.isLock !== true}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onTransformEnd={handleTransformEnd}
        strokeScaleEnabled={false}
        {...spec}
        {...spec.cssStyle}
        strokeWidth={strokeWidth}
        visible={drawObjectState ? !drawObjectState.isHidden : true}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorFill={CIRCLE_STYLE.fill}
          anchorCornerRadius={CORNER_RADIUS}
          anchorStrokeWidth={CIRCLE_STYLE.strokeWidth}
          anchorStroke={CIRCLE_STYLE.stroke}
          anchorSize={CORNER_RADIUS * 1.8}
          ignoreStroke={true}
          boundBoxFunc={boundBoxFunc}
        />
      )}
    </React.Fragment>
  );
};
export default Rectangle;
