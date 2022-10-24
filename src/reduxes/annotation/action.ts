import {
  ADD_DRAW_OBJECTS_BY_AI,
  CHANGE_CURRENT_DRAW_STATE,
  CHANGE_CURRENT_DRAW_TYPE,
  CHANGE_ZOOM,
  CREATE_DRAW_OBJECT,
  DELETE_DRAW_OBJECT,
  REDO_DRAW_OBJECT,
  REMOVE_DRAW_OBJECTS_BY_AI,
  RESET_CURRENT_STATE_DRAW_OBJECT,
  SET_DETECTED_AREA,
  SET_HIDDEN_DRAW_OBJECT,
  SET_IS_DRAGGING_VIEW_PORT,
  SET_LOCK_DRAW_OBJECT,
  SET_SELECT_SHAPE,
  UNDO_DRAW_OBJECT,
  UPDATE_DRAW_OBJECT,
  UPDATE_LABEL_OF_DRAW_OBJECT,
} from "./constants";
import {
  AddDrawObjectStateIdByAIPayload,
  ChangeCurrentDrawStatePayload,
  ChangeCurrentDrawTypePayload,
  ChangeZoomPayload,
  CreateDrawObjectPayload,
  DeleteDrawObjectPayload,
  RemoveDrawObjectStateIdByAIPayload,
  ResetCurrentStateDrawObjectPayload,
  SetHiddenDrawObjectPayload,
  SetIsDraggingViewportPayload,
  SetLockDetectedAreaPayload,
  SetLockDrawObecjtPayload,
  SetSelectShapePayload,
  UpdateDrawObjectPayload,
  UpdateLabelOfDrawObjectPayload,
} from "./type";

export const changeCurrentDrawType = (
  payload: ChangeCurrentDrawTypePayload
) => ({
  type: CHANGE_CURRENT_DRAW_TYPE,
  payload,
});
export const changeZoom = (payload: ChangeZoomPayload) => ({
  type: CHANGE_ZOOM,
  payload,
});
export const createDrawObject = (payload: CreateDrawObjectPayload) => ({
  type: CREATE_DRAW_OBJECT,
  payload,
});
export const updateDrawObject = (payload: UpdateDrawObjectPayload) => ({
  type: UPDATE_DRAW_OBJECT,
  payload,
});

export const changeCurrentStatus = (
  payload: ChangeCurrentDrawStatePayload
) => ({
  type: CHANGE_CURRENT_DRAW_STATE,
  payload,
});
export const setSelectedShape = (payload: SetSelectShapePayload) => ({
  type: SET_SELECT_SHAPE,
  payload,
});
export const deleteDrawObject = (payload: DeleteDrawObjectPayload) => ({
  type: DELETE_DRAW_OBJECT,
  payload,
});
export const resetCurrentStateDrawObject = (
  payload: ResetCurrentStateDrawObjectPayload
) => ({
  type: RESET_CURRENT_STATE_DRAW_OBJECT,
  payload,
});
export const updateLabelOfDrawObject = (
  payload: UpdateLabelOfDrawObjectPayload
) => ({
  type: UPDATE_LABEL_OF_DRAW_OBJECT,
  payload,
});
export const undoDrawObject = () => ({
  type: UNDO_DRAW_OBJECT,
});
export const redoDrawObject = () => ({
  type: REDO_DRAW_OBJECT,
});
export const setHiddenDrawObject = (payload: SetHiddenDrawObjectPayload) => ({
  type: SET_HIDDEN_DRAW_OBJECT,
  payload,
});
export const setLockDrawObject = (payload: SetLockDrawObecjtPayload) => ({
  type: SET_LOCK_DRAW_OBJECT,
  payload,
});
export const setDetectedArea = (payload: SetLockDetectedAreaPayload) => ({
  type: SET_DETECTED_AREA,
  payload,
});
export const setIsDraggingViewpor = (
  payload: SetIsDraggingViewportPayload
) => ({
  type: SET_IS_DRAGGING_VIEW_PORT,
  payload,
});
export const addDrawObjectStateIdByAI = (
  payload: AddDrawObjectStateIdByAIPayload
) => ({
  type: ADD_DRAW_OBJECTS_BY_AI,
  payload,
});
export const removeDrawObjectStateIdByAI = (
  payload: RemoveDrawObjectStateIdByAIPayload
) => ({
  type: REMOVE_DRAW_OBJECTS_BY_AI,
  payload,
});
