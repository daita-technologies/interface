import {
  CHANGE_CURRENT_DRAW_STATE,
  CHANGE_CURRENT_DRAW_TYPE,
  CHANGE_ZOOM,
  CREATE_DRAW_OBJECT,
  DELETE_DRAW_OBJECT,
  REDO_DRAW_OBJECT,
  RESET_CURRENT_STATE_DRAW_OBJECT,
  SET_DETECTED_AREA,
  SET_HIDDEN_DRAW_OBJECT,
  SET_LOCK_DRAW_OBJECT,
  SET_SELECT_SHAPE,
  UNDO_DRAW_OBJECT,
  UPDATE_DRAW_OBJET,
  UPDATE_LABEL_OF_DRAW_OBJECT,
} from "./constants";
import {
  ChangeCurrentDrawStatePayload,
  ChangeCurrentDrawTypePayload,
  ChangeZoomPayload,
  CreateDrawObjectPayload,
  DeleteDrawObjectPayload,
  ResetCurrentStateDrawObjectPayload,
  SetHiddenDrawObjectPayload,
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
  type: UPDATE_DRAW_OBJET,
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