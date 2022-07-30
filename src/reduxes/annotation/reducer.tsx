import {
  initialEllipses,
  initialPolygons,
  initialRectangles,
} from "components/Annotation/Editor/type";
import {
  CHANGE_CURRENT_DRAW_STATE,
  CHANGE_CURRENT_DRAW_TYPE,
  CHANGE_ZOOM,
  CREATE_DRAW_OBJECT,
  SET_SELECT_SHAPE,
  UPDATE_DRAW_OBJET,
} from "./constants";
import {
  AnnotationReducer,
  ChangeCurrentDrawStatePayload,
  ChangeCurrentDrawTypePayload,
  ChangeZoomPayload,
  CreateDrawObjectPayload,
  DrawObject,
  DrawState,
  DrawType,
  SetSelectShapePayload,
  UpdateDrawObjectPayload,
} from "./type";

const inititalState: AnnotationReducer = {
  currentDrawType: DrawType.RECTANGLE,
  selectedShapeId: null,
  zoom: { zoom: 1, position: { x: 0, y: 0 } },
  // drawObjectById: (() => {
  //   const ret: Record<string, DrawObject> = {};
  //   Object.keys(initialRectangles).forEach((id) => {
  //     const obj = initialRectangles[id];
  //     ret[obj.id] = {
  //       type: DrawType.RECTANGLE,
  //       data: obj,
  //     };
  //   });
  //   Object.keys(initialPolygons).forEach((id) => {
  //     const obj = initialPolygons[id];
  //     ret[obj.id] = {
  //       type: DrawType.POLYGON,
  //       data: obj,
  //     };
  //   });
  //   Object.keys(initialEllipses).forEach((id) => {
  //     const obj = initialEllipses[id];
  //     ret[obj.id] = {
  //       type: DrawType.ELLIPSE,
  //       data: obj,
  //     };
  //   });
  //   return ret;
  // })(),
  drawObjectById: {},
  currentDrawState: DrawState.FREE,
};
const annotationReducer = (
  state = inititalState,
  action: any
): AnnotationReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case CHANGE_CURRENT_DRAW_TYPE: {
      const { currentDrawType } = payload as ChangeCurrentDrawTypePayload;
      return {
        ...state,
        currentDrawType,
        selectedShapeId: null,
        currentDrawState: DrawState.FREE,
      };
    }
    case CHANGE_ZOOM: {
      const { zoom } = payload as ChangeZoomPayload;
      return {
        ...state,
        zoom: { ...zoom },
      };
    }
    case CREATE_DRAW_OBJECT: {
      const { drawObject } = payload as CreateDrawObjectPayload;
      return {
        ...state,
        drawObjectById: {
          ...state.drawObjectById,
          [drawObject.data.id]: drawObject,
        },
      };
    }
    case UPDATE_DRAW_OBJET: {
      const { data } = payload as UpdateDrawObjectPayload;
      const drawObject = state.drawObjectById[data.id];
      return {
        ...state,
        drawObjectById: {
          ...state.drawObjectById,
          [data.id]: {
            ...drawObject,
            data: { ...data },
          },
        },
      };
    }
    case CHANGE_CURRENT_DRAW_STATE: {
      const { drawState } = payload as ChangeCurrentDrawStatePayload;
      return {
        ...state,
        selectedShapeId:
          drawState === DrawState.FREE ? null : state.selectedShapeId,
        currentDrawState: drawState,
      };
    }
    case SET_SELECT_SHAPE: {
      const { selectedShapeId } = payload as SetSelectShapePayload;
      return {
        ...state,
        currentDrawState: DrawState.SELECTING,
        selectedShapeId,
      };
    }
    default:
      return state;
  }
};

export default annotationReducer;
