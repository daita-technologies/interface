import { PolygonSpec } from "components/Annotation/Editor/type";
import {
  ADD_DRAW_OBJECTS_BY_AI,
  CHANGE_CURRENT_DRAW_STATE,
  CHANGE_CURRENT_DRAW_TYPE,
  CHANGE_ZOOM,
  CREATE_DRAW_OBJECT,
  DELETE_DRAW_OBJECT,
  HIDDEN_ALL_DRAW_OBJECTS_BY_AI,
  RECOVER_PREVIOUS_DRAWSTATE,
  REDO_DRAW_OBJECT,
  RESET_ANNOTATION,
  RESET_CURRENT_STATE_DRAW_OBJECT,
  SET_DETECTED_AREA,
  SET_HIDDEN_DRAW_OBJECT,
  SET_IS_DRAGGING_VIEW_PORT,
  SET_KEY_DOWN_IN_EDITOR,
  SET_LOCK_DRAW_OBJECT,
  SET_MOUSE_DOWN_OUT_LAYER_POSITION,
  SET_MOUSE_UP_OUT_LAYER_POSITION,
  SET_SELECT_SHAPE,
  SHOW_ALL_DRAW_OBJECTS_BY_AI,
  SHOW_DRAW_OBJECTS_BY_AI,
  UNDO_DRAW_OBJECT,
  UPDATE_DRAW_OBJECT,
  UPDATE_LABEL_OF_DRAW_OBJECT,
} from "./constants";
import {
  AddDrawObjectStateIdByAIPayload,
  AnnotationReducer,
  ChangeCurrentDrawStatePayload,
  ChangeCurrentDrawTypePayload,
  ChangeZoomPayload,
  CreateDrawObjectPayload,
  DeleteDrawObjectPayload,
  DrawObject,
  DrawObjectByAIState,
  DrawObjectState,
  DrawState,
  DrawType,
  ResetCurrentStateDrawObjectPayload,
  SetHiddenDrawObjectPayload,
  SetIsDraggingViewportPayload,
  SetKeyDownPayload,
  SetLockDetectedAreaPayload,
  SetLockDrawObecjtPayload,
  SetMouseOutLayerPosition,
  SetSelectShapePayload,
  ShowDrawObjectStateIdByAIPayload,
  StateHistory,
  UpdateDrawObjectPayload,
  UpdateLabelOfDrawObjectPayload,
} from "./type";

const inititalState: AnnotationReducer = {
  currentDrawType: null,
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
  currentDrawState: DrawState.SELECTING,
  previousDrawState: DrawState.SELECTING,
  statehHistory: { historyStep: 0, stateHistoryItems: [] },
  drawObjectStateById: {},
  detectedArea: null,
  isDraggingViewport: false,
  drawObjectStateIdByAI: {},
  keyDownInEditor: null,
  mouseUpOutLayerPosition: null,
  mouseDownOutLayerPosition: null,
};
const updateStateHistory = (
  drawObjectById: Record<string, DrawObject>,
  statehHistory: StateHistory
) => {
  let newStateHistory = { ...statehHistory };
  if (
    newStateHistory.historyStep >= 0 &&
    newStateHistory.historyStep < newStateHistory.stateHistoryItems.length
  ) {
    newStateHistory.stateHistoryItems = newStateHistory.stateHistoryItems.slice(
      0,
      newStateHistory.historyStep
    );
  }
  newStateHistory.historyStep = newStateHistory.stateHistoryItems.length + 1;
  newStateHistory.stateHistoryItems = [
    ...newStateHistory.stateHistoryItems,
    {
      drawObjectById: structuredClone(drawObjectById),
    },
  ];
  return newStateHistory;
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
        currentDrawState: currentDrawType
          ? DrawState.FREE
          : DrawState.SELECTING,
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
      let newStateHistory = updateStateHistory(
        state.drawObjectById,
        state.statehHistory
      );
      return {
        ...state,
        drawObjectById: {
          ...state.drawObjectById,
          [drawObject.data.id]: drawObject,
        },
        statehHistory: newStateHistory,
      };
    }
    case UPDATE_DRAW_OBJECT: {
      const { data } = payload as UpdateDrawObjectPayload;
      const drawObject = state.drawObjectById[data.id];
      let newStateHistory = state.statehHistory;
      if (state.currentDrawState !== DrawState.DRAWING) {
        newStateHistory = updateStateHistory(
          state.drawObjectById,
          state.statehHistory
        );
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
        previousDrawState: state.currentDrawState,
      };
    }
    case SET_SELECT_SHAPE: {
      const { selectedDrawObjectId } = payload as SetSelectShapePayload;
      // if (selectedDrawObjectId) {
      //   const stateDrawObject = state.drawObjectStateById[selectedDrawObjectId];
      //   if (stateDrawObject && stateDrawObject.isLock === true) {
      //     return state;
      //   }
      // }
      return {
        ...state,
        currentDrawState: DrawState.SELECTING,
        selectedDrawObjectId,
      };
    }
    case DELETE_DRAW_OBJECT: {
      const { drawObjectId } = payload as DeleteDrawObjectPayload;
      const newStateHistory = updateStateHistory(
        state.drawObjectById,
        state.statehHistory
      );
      delete state.drawObjectById[drawObjectId];
      return {
        ...state,
        selectedDrawObjectId: null,
        drawObjectById: { ...state.drawObjectById },
        statehHistory: newStateHistory,
      };
    }
    case RESET_CURRENT_STATE_DRAW_OBJECT: {
      const { drawObjectById } = payload as ResetCurrentStateDrawObjectPayload;
      if (!drawObjectById) {
        return state;
      }
      const drawObjectStateById: Record<string, DrawObjectState> = {};
      Object.keys(drawObjectById).forEach((key) => {
        drawObjectStateById[key] = { isHidden: false };
      });
      return {
        ...state,
        ...inititalState,
        drawObjectById: { ...drawObjectById },
        drawObjectStateById,
        drawObjectStateIdByAI: { ...state.drawObjectStateIdByAI },
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
        const undoDrawObjectById =
          statehHistory.stateHistoryItems[state.statehHistory.historyStep - 1]
            .drawObjectById;
        Object.entries(undoDrawObjectById).map(([key, value]) => {
          undoDrawObjectById[key].data = {
            ...undoDrawObjectById[key].data,
            label: value.data.label,
            cssStyle: value.data.cssStyle,
          };
        });
        return {
          ...state,
          drawObjectById: undoDrawObjectById,
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
        state.statehHistory.stateHistoryItems.length - 1
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
    case SET_HIDDEN_DRAW_OBJECT: {
      const { drawObjectId, isHidden } = payload as SetHiddenDrawObjectPayload;
      const drawObjectState = state.drawObjectStateById[drawObjectId];
      const newDrawObjectState = drawObjectState
        ? {
            ...drawObjectState,
            isHidden,
          }
        : { isHidden };

      return {
        ...state,
        drawObjectStateById: {
          ...state.drawObjectStateById,
          [drawObjectId]: newDrawObjectState,
        },
      };
    }
    case SET_LOCK_DRAW_OBJECT: {
      const { drawObjectId, isLock } = payload as SetLockDrawObecjtPayload;
      const drawObjectState = state.drawObjectStateById[drawObjectId];
      const newDrawObjectState = drawObjectState
        ? {
            ...drawObjectState,
            isLock,
          }
        : { isLock };

      return {
        ...state,
        drawObjectStateById: {
          ...state.drawObjectStateById,
          [drawObjectId]: newDrawObjectState,
        },
      };
    }
    case SET_DETECTED_AREA: {
      const { detectedArea, scale } = payload as SetLockDetectedAreaPayload;
      const newDrawObjectStateIdByAI = { ...state.drawObjectStateIdByAI };
      if (detectedArea) {
        const scaleX = 1 / scale.x;
        const scaleY = 1 / scale.y;

        for (const drawObjectId of Object.keys(state.drawObjectStateIdByAI)) {
          const drawObject = state.drawObjectById[drawObjectId];
          if (drawObject) {
            const { type, data } = drawObject;
            if (type === DrawType.POLYGON) {
              const points = (data as PolygonSpec).points;
              const isInvalid = points.some((point) => {
                return (
                  point.x < detectedArea.x * scaleX ||
                  point.y < detectedArea.y * scaleY ||
                  point.x > (detectedArea.x + detectedArea.width) * scaleX ||
                  point.y > (detectedArea.y + detectedArea.height) * scaleY
                );
              });
              if (!isInvalid) {
                newDrawObjectStateIdByAI[drawObjectId] = {
                  ...newDrawObjectStateIdByAI[drawObjectId],
                  isShow: true,
                };
              }
            }
          }
        }
      }
      return {
        ...state,
        detectedArea,
        drawObjectStateIdByAI: newDrawObjectStateIdByAI,
      };
    }
    case SET_IS_DRAGGING_VIEW_PORT: {
      const { isDraggingViewport } = payload as SetIsDraggingViewportPayload;
      return {
        ...state,
        isDraggingViewport,
      };
    }
    case ADD_DRAW_OBJECTS_BY_AI: {
      const { drawObjectStateIds } = payload as AddDrawObjectStateIdByAIPayload;
      const newDrawObjectStateIdByAI = { ...state.drawObjectStateIdByAI };
      drawObjectStateIds.forEach((id) => {
        if (!state.drawObjectStateIdByAI[id]) {
          newDrawObjectStateIdByAI[id] = { isShow: false };
        }
      });
      return {
        ...state,
        drawObjectStateIdByAI: newDrawObjectStateIdByAI,
      };
    }
    case SHOW_DRAW_OBJECTS_BY_AI: {
      const { drawObjectStateIds } =
        payload as ShowDrawObjectStateIdByAIPayload;
      const newDrawObjectStateIdByAI = { ...state.drawObjectStateIdByAI };
      drawObjectStateIds.forEach((id) => {
        delete newDrawObjectStateIdByAI[id];
      });
      return {
        ...state,
        drawObjectStateIdByAI: newDrawObjectStateIdByAI,
      };
    }
    case RESET_ANNOTATION: {
      return { ...inititalState };
    }
    case RECOVER_PREVIOUS_DRAWSTATE: {
      return {
        ...state,
        currentDrawState: state.previousDrawState,
      };
    }
    case SHOW_ALL_DRAW_OBJECTS_BY_AI: {
      const newDrawObjectStateIdByAI: Record<string, DrawObjectByAIState> = {};
      Object.entries(state.drawObjectStateIdByAI).map(([key, value]) => {
        newDrawObjectStateIdByAI[key] = { ...value, isShow: true };
      });
      return { ...state, drawObjectStateIdByAI: newDrawObjectStateIdByAI };
    }
    case HIDDEN_ALL_DRAW_OBJECTS_BY_AI: {
      const newDrawObjectStateIdByAI: Record<string, DrawObjectByAIState> = {};
      Object.entries(state.drawObjectStateIdByAI).map(([key, value]) => {
        newDrawObjectStateIdByAI[key] = { ...value, isShow: false };
      });
      return { ...state, drawObjectStateIdByAI: newDrawObjectStateIdByAI };
    }
    case SET_KEY_DOWN_IN_EDITOR: {
      const { keyDownInEditor } = payload as SetKeyDownPayload;
      return { ...state, keyDownInEditor };
    }
    case SET_MOUSE_UP_OUT_LAYER_POSITION: {
      const { position } = payload as SetMouseOutLayerPosition;
      return {
        ...state,
        mouseUpOutLayerPosition: position,
      };
    }
    case SET_MOUSE_DOWN_OUT_LAYER_POSITION: {
      const { position } = payload as SetMouseOutLayerPosition;
      return {
        ...state,
        mouseDownOutLayerPosition: position,
      };
    }
    default:
      return state;
  }
};

export default annotationReducer;
