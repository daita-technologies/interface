import { PolygonSpec } from "components/Annotation/Editor/type";
import { Vector2d } from "konva/lib/types";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentStatus,
  createDrawObject,
  setSelectedShape,
  updateDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorSelectedPolygon,
} from "reduxes/annotation/selector";
import {
  DrawObject,
  DrawState,
  DrawType,
  EditorEventPayload,
} from "reduxes/annotation/type";

export const createPolygon = (position: Vector2d): DrawObject => {
  const id = `POLYGON-${Math.floor(Math.random() * 100000)}`;
  const polygon: PolygonSpec = {
    id: id,
    points: [position],
    polygonState: { isFinished: false },
    label: { label: id },
  };
  return { type: DrawType.POLYGON, data: polygon };
};
const buildPolygon = (polygon: PolygonSpec, position: Vector2d) => {
  const { x, y } = polygon.points[0];
  const a = x - position.x;
  const b = y - position.y;

  const distance = Math.sqrt(a * a + b * b);
  if (distance < 100) {
    polygon.polygonState.isFinished = true;
  } else {
    polygon.points = [...polygon.points, position];
  }
  return { data: { ...polygon } };
};
const usePolygonEvent = () => {
  const dispatch = useDispatch();
  const polygon = useSelector(selectorSelectedPolygon);
  const currentDrawState = useSelector(selectorCurrentDrawState);

  const handleMouseDown = (e: EditorEventPayload) => {
    const position = e.eventObject.currentTarget.getRelativePointerPosition();
    if (!position) return;
    if (polygon === null || polygon.polygonState.isFinished) {
      if (
        currentDrawState === DrawState.FREE ||
        currentDrawState === DrawState.SELECTING
      ) {
        let drawObject = createPolygon(position);
        dispatch(createDrawObject({ drawObject }));
        dispatch(
          setSelectedShape({ selectedDrawObjectId: drawObject.data.id })
        );
        dispatch(changeCurrentStatus({ drawState: DrawState.DRAWING }));
      }
    } else {
      const polygonAfterBuild = buildPolygon(polygon as PolygonSpec, position);
      dispatch(updateDrawObject(polygonAfterBuild));
    }
  };

  const handleMouseMove = (e: EditorEventPayload) => {
    if (currentDrawState === DrawState.DRAWING) {
      const position = e.eventObject.currentTarget.getRelativePointerPosition();
      if (!position) return;
      if (polygon) {
        const polygonSpec = polygon as PolygonSpec;
        polygonSpec.polygonState.mousePosition = position;
        dispatch(updateDrawObject({ data: polygonSpec }));
      }
    }
  };

  return { handleMouseDown, handleMouseMove };
};

export default usePolygonEvent;
