import { KonvaEventObject } from "konva/lib/Node";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawState,
  setSelectedShape,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorIsDraggingViewport,
  selectorListDrawObjectLock,
} from "reduxes/annotation/selector";
import { DrawState } from "reduxes/annotation/type";
import { DrawObjectType } from "./type";

const useCommonShapeEvent = ({
  drawObject,
}: {
  drawObject: DrawObjectType;
}) => {
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const listDrawObjectLock = useSelector(selectorListDrawObjectLock);
  const isDraggingViewport = useSelector(selectorIsDraggingViewport);

  const isLock = useMemo(
    () =>
      listDrawObjectLock.indexOf(drawObject.id) !== -1 ||
      isDraggingViewport === true,
    [listDrawObjectLock]
  );
  const dispatch = useDispatch();
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    dispatch(
      changeCurrentDrawState({
        drawState: DrawState.SELECTING,
      })
    );
    e.cancelBubble = true;
  };
  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    dispatch(
      changeCurrentDrawState({
        drawState: DrawState.DRAGGING,
      })
    );
    e.cancelBubble = true;
  };
  const handleCick = (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
  };
  const handleTransformStart = (e: KonvaEventObject<MouseEvent>) => {
    dispatch(
      changeCurrentDrawState({
        drawState: DrawState.TRANSFORMING,
      })
    );
    e.cancelBubble = true;
  };
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    dispatch(
      changeCurrentDrawState({
        drawState: DrawState.SELECTING,
      })
    );
    e.cancelBubble = true;
  };
  const handleSelect = (e: KonvaEventObject<MouseEvent>) => {
    if (
      currentDrawState === DrawState.FREE ||
      currentDrawState === DrawState.SELECTING
    ) {
      dispatch(setSelectedShape({ selectedDrawObjectId: drawObject.id }));
      e.cancelBubble = true;
    }
  };
  const handleMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target?.getStage();
    if (stage) {
      const container = stage.container();
      if (currentDrawState === DrawState.SELECTING) {
        container.style.cursor = "move";
      } else {
        container.style.cursor = "default";
      }
    }
  };
  const handleMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target?.getStage();
    if (stage) {
      const container = stage.container();
      container.style.cursor = "default";
    }
  };
  return {
    handleDragEnd,
    handleDragStart,
    handleCick,
    handleTransformStart,
    handleTransformEnd,
    handleSelect,
    handleMouseEnter,
    handleMouseLeave,
    isLock,
  };
};
export default useCommonShapeEvent;
