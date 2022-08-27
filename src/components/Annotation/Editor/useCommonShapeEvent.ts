import { KonvaEventObject } from "konva/lib/Node";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentStatus,
  setSelectedShape,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
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
  const isLock = useMemo(
    () => listDrawObjectLock.indexOf(drawObject.id) !== -1,
    [listDrawObjectLock]
  );
  const dispatch = useDispatch();
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    dispatch(
      changeCurrentStatus({
        drawState: DrawState.SELECTING,
      })
    );
    e.cancelBubble = true;
  };
  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    dispatch(
      changeCurrentStatus({
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
      changeCurrentStatus({
        drawState: DrawState.TRANSFORMING,
      })
    );
    e.cancelBubble = true;
  };
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    dispatch(
      changeCurrentStatus({
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

  return {
    handleDragEnd,
    handleDragStart,
    handleCick,
    handleTransformStart,
    handleTransformEnd,
    handleSelect,
    isLock,
  };
};
export default useCommonShapeEvent;
