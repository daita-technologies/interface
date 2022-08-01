import { LINE_STYLE } from "components/Annotation/Editor/const";
import { EllipseSpec } from "components/Annotation/Editor/type";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentStatus,
  createDrawObject,
  setSelectedShape,
  updateDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorSelectedEllipse,
} from "reduxes/annotation/selector";
import {
  DrawObject,
  DrawState,
  DrawType,
  EditorEventPayload,
} from "reduxes/annotation/type";
function createRectangle(position: { x: number; y: number }): DrawObject {
  const id = `ELLIPSE-${Math.floor(Math.random() * 100000)}`;
  const shape: EllipseSpec = {
    x: position.x,
    y: position.y,
    radiusX: 1,
    radiusY: 1,
    rotation: 0,
    id,
    label: { label: id },
    ...LINE_STYLE,
  };
  return { type: DrawType.ELLIPSE, data: shape };
}
const useEllipseEvent = () => {
  const dispatch = useDispatch();
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const selectedShape = useSelector(selectorSelectedEllipse);
  const handleMouseDown = (e: EditorEventPayload) => {
    if (currentDrawState === DrawState.FREE) {
      const position = e.eventObject.currentTarget.getRelativePointerPosition();
      console.log("position", position);
      let drawObject = createRectangle(position);
      dispatch(createDrawObject({ drawObject }));
      dispatch(setSelectedShape({ selectedDrawObjectId: drawObject.data.id }));
      dispatch(changeCurrentStatus({ drawState: DrawState.DRAWING }));
    }
  };

  const handleMouseMove = (e: EditorEventPayload) => {
    if (currentDrawState === DrawState.DRAWING) {
      const position = e.eventObject.currentTarget.getRelativePointerPosition();

      if (selectedShape) {
        const newShape: EllipseSpec = {
          ...selectedShape,
          x: (position.x + (selectedShape.x - selectedShape.radiusX)) / 2,
          y: (position.y + (selectedShape.y - selectedShape.radiusY)) / 2,
          radiusX:
            (position.x - (selectedShape.x - selectedShape.radiusX)) / 2.0,
          radiusY:
            (position.y - (selectedShape.y - selectedShape.radiusY)) / 2.0,
        };
        console.log(newShape.radiusX, newShape.radiusY);
        dispatch(updateDrawObject({ data: newShape }));
      }
    }
  };
  const handleMouseUp = () => {
    if (currentDrawState === DrawState.DRAWING) {
      dispatch(changeCurrentStatus({ drawState: DrawState.SELECTING }));
    }
  };
  return { handleMouseDown, handleMouseMove, handleMouseUp };
};

export default useEllipseEvent;
