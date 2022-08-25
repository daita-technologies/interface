import {
  initialEllipses,
  initialLineStrips,
  initialPolygons,
  initialRectangles,
} from "components/Annotation/Editor/type";
import { constant } from "lodash";
import {
  CHANGE_CURRENT_DRAW_STATE,
  CHANGE_CURRENT_DRAW_TYPE,
  CHANGE_ZOOM,
  CREATE_DRAW_OBJECT,
  DELETE_DRAW_OBJECT,
  REDO_DRAW_OBJECT,
  RESET_CURRENT_STATE_DRAW_OBJECT,
  SET_SELECT_SHAPE,
  UNDO_DRAW_OBJECT,
  UPDATE_DRAW_OBJET,
  UPDATE_LABEL_OF_DRAW_OBJECT,
} from "./constants";
import {
  AnnotationReducer,
  ChangeCurrentDrawStatePayload,
  ChangeCurrentDrawTypePayload,
  ChangeZoomPayload,
  CreateDrawObjectPayload,
  DeleteDrawObjectPayload,
  DrawObject,
  DrawState,
  DrawType,
  ResetCurrentStateDrawObjectPayload,
  SetSelectShapePayload,
  UpdateDrawObjectPayload,
  UpdateLabelOfDrawObjectPayload,
} from "./type";

const inititalState: AnnotationReducer = {
  currentDrawType: DrawType.POLYGON,
  selectedDrawObjectId: null,
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
  //   Object.keys(initialLineStrips).forEach((id) => {
  //     const obj = initialLineStrips[id];
  //     ret[obj.id] = {
  //       type: DrawType.LINE_STRIP,
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
  statehHistory: { historyStep: 0, stateHistoryItems: [] },
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
        selectedDrawObjectId: null,
        currentDrawState: DrawState.FREE,
      };
    }
    case CHANGE_ZOOM: {
      const { zoom } = payload as ChangeZoomPayload;
      if (zoom.zoom > 3) {
        return state;
      }
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
      const { statehHistory } = state;
      let newStateHistory = statehHistory;
      if (state.currentDrawState !== DrawState.DRAWING) {
        statehHistory.historyStep = statehHistory.stateHistoryItems.length + 1;
        statehHistory.stateHistoryItems = [
          ...statehHistory.stateHistoryItems,
          {
            drawObjectById: structuredClone(state.drawObjectById),
          },
        ];
        newStateHistory = { ...statehHistory };
      }
      return {
        ...state,
        drawObjectById: {
          ...state.drawObjectById,
          [data.id]: {
            ...drawObject,
            data: { ...data },
          },
        },
        statehHistory: newStateHistory,
      };
    }
    case CHANGE_CURRENT_DRAW_STATE: {
      const { drawState } = payload as ChangeCurrentDrawStatePayload;
      return {
        ...state,
        selectedDrawObjectId:
          drawState === DrawState.FREE ? null : state.selectedDrawObjectId,
        currentDrawState: drawState,
      };
    }
    case SET_SELECT_SHAPE: {
      const { selectedDrawObjectId } = payload as SetSelectShapePayload;
      return {
        ...state,
        currentDrawState: DrawState.SELECTING,
        selectedDrawObjectId,
      };
    }
    case DELETE_DRAW_OBJECT: {
      const { drawObjectId } = payload as DeleteDrawObjectPayload;
      delete state.drawObjectById[drawObjectId];
      return {
        ...state,
        currentDrawState: DrawState.FREE,
        selectedDrawObjectId: null,
        drawObjectById: { ...state.drawObjectById },
      };
    }
    case RESET_CURRENT_STATE_DRAW_OBJECT: {
      const { drawObjectById } = payload as ResetCurrentStateDrawObjectPayload;
      return {
        ...state,
        currentDrawState: DrawState.FREE,
        selectedDrawObjectId: null,
        drawObjectById: { ...drawObjectById },
        zoom: { zoom: 1, position: { x: 0, y: 0 } },
      };
    }
    case UPDATE_LABEL_OF_DRAW_OBJECT: {
      const { drawObjectId, labelClassProperties } =
        payload as UpdateLabelOfDrawObjectPayload;
      const drawObject = state.drawObjectById[drawObjectId];
      drawObject.data.label = labelClassProperties.label;
      drawObject.data.cssStyle = {
        ...drawObject.data.cssStyle,
        ...labelClassProperties.cssStyle,
      };
      return {
        ...state,
        drawObjectById: {
          ...state.drawObjectById,
          [drawObjectId]: { ...drawObject },
        },
      };
    }
    case UNDO_DRAW_OBJECT: {
      const { statehHistory } = state;
      if (state.statehHistory.historyStep > 0) {
        let stateHistoryItems;
        if (
          state.statehHistory.historyStep ===
          state.statehHistory.stateHistoryItems.length
        ) {
          stateHistoryItems = [
            ...statehHistory.stateHistoryItems,
            {
              drawObjectById: structuredClone(state.drawObjectById),
            },
          ];
        } else {
          stateHistoryItems = [...state.statehHistory.stateHistoryItems];
        }
        return {
          ...state,
          drawObjectById:
            statehHistory.stateHistoryItems[state.statehHistory.historyStep - 1]
              .drawObjectById,
          statehHistory: {
            ...state.statehHistory,
            stateHistoryItems,
            historyStep: statehHistory.historyStep - 1,
          },
        };
      } else {
        return state;
      }
    }
    case REDO_DRAW_OBJECT: {
      const { statehHistory } = state;
      if (
        state.statehHistory.historyStep <
        state.statehHistory.stateHistoryItems.length
      ) {
        return {
          ...state,
          drawObjectById:
            statehHistory.stateHistoryItems[state.statehHistory.historyStep + 1]
              .drawObjectById,
          statehHistory: {
            ...statehHistory,
            historyStep: statehHistory.historyStep + 1,
          },
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export default annotationReducer;
