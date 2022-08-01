import { LINE_STYLE } from "components/Annotation/Editor/const";
import { RectangleSpec } from "components/Annotation/Editor/type";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentStatus,
  createDrawObject,
  setSelectedShape,
  updateDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorSelectedRectangle,
} from "reduxes/annotation/selector";
import {
  DrawObject,
  DrawState,
  DrawType,
  EditorEventPayload,
} from "reduxes/annotation/type";
function createRectangle(position: { x: number; y: number }): DrawObject {
  const id = `RECTANGLE-${Math.floor(Math.random() * 100000)}`;
  const rect: RectangleSpec = {
    x: position.x,
    y: position.y,
    width: 10,
    height: 10,
    id: id,
    rotation: 0,
    label: { label: id },
    ...LINE_STYLE,
  };
  return { type: DrawType.RECTANGLE, data: rect };
}
const useRectangleEvent = () => {
  const dispatch = useDispatch();
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const selectedRectangle = useSelector(selectorSelectedRectangle);
  const handleMouseDown = (e: EditorEventPayload) => {
    if (currentDrawState === DrawState.FREE) {
      const position = e.eventObject.currentTarget.getRelativePointerPosition();
      let drawObject = createRectangle(position);
      dispatch(createDrawObject({ drawObject }));
      dispatch(setSelectedShape({ selectedDrawObjectId: drawObject.data.id }));
      dispatch(changeCurrentStatus({ drawState: DrawState.DRAWING }));
    }
  };

  const handleMouseMove = (e: EditorEventPayload) => {
    if (currentDrawState === DrawState.DRAWING) {
      const position = e.eventObject.currentTarget.getRelativePointerPosition();

      if (selectedRectangle) {
        const rectangle = selectedRectangle;
        const newWidth = position.x - rectangle.x;
        const newHeight = position.y - rectangle.y;
        rectangle.width = newWidth;
        rectangle.height = newHeight;
        dispatch(updateDrawObject({ data: rectangle }));
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

export default useRectangleEvent;
