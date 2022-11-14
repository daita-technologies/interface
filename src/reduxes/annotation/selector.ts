import {
  EllipseSpec,
  PolygonSpec,
  RectangleSpec,
} from "components/Annotation/Editor/type";
import { RootState } from "reduxes";
import { DrawType } from "./type";

export const selectorCurrentDrawType = (state: RootState) =>
  state.annotationReducer.currentDrawType;
export const selectorSelectedDrawObjectId = (state: RootState) =>
  state.annotationReducer.selectedDrawObjectId;
export const selectorSelectedPolygonOrLineStrip = (
  state: RootState
): PolygonSpec | null => {
  if (state.annotationReducer.selectedDrawObjectId) {
    const shape =
      state.annotationReducer.drawObjectById[
        state.annotationReducer.selectedDrawObjectId
      ];
    if (
      shape &&
      (shape.type === DrawType.POLYGON || shape.type === DrawType.LINE_STRIP)
    ) {
      return shape.data as PolygonSpec;
    }
  }
  return null;
};

export const selectorSelectedRectangle = (
  state: RootState
): RectangleSpec | null => {
  if (state.annotationReducer.selectedDrawObjectId) {
    const shape =
      state.annotationReducer.drawObjectById[
        state.annotationReducer.selectedDrawObjectId
      ];
    if (shape && shape.type === DrawType.RECTANGLE) {
      return shape.data as RectangleSpec;
    }
  }
  return null;
};
export const selectorSelectedEllipse = (
  state: RootState
): EllipseSpec | null => {
  if (state.annotationReducer.selectedDrawObjectId) {
    const shape =
      state.annotationReducer.drawObjectById[
        state.annotationReducer.selectedDrawObjectId
      ];
    if (shape && shape.type === DrawType.ELLIPSE) {
      return shape.data as EllipseSpec;
    }
  }
  return null;
};
export const selectorDrawObjectById = (state: RootState) =>
  state.annotationReducer.drawObjectById;
export const selectorCurrentDrawState = (state: RootState) =>
  state.annotationReducer.currentDrawState;
export const selectorPreviousDrawState = (state: RootState) =>
  state.annotationReducer.previousDrawState;
export const selectorZoom = (state: RootState) => state.annotationReducer.zoom;
export const selectorAnnotationHistoryStep = (state: RootState) =>
  state.annotationReducer.statehHistory.historyStep;
export const selectorAnnotationStatehHistory = (state: RootState) =>
  state.annotationReducer.statehHistory;
export const selectorListDrawObjectLock = (state: RootState) =>
  Object.entries(state.annotationReducer.drawObjectStateById)
    .filter(([, value]) => value.isLock === true)
    .map(([key]) => key);
export const selectorListDrawObjectHidden = (state: RootState) =>
  Object.entries(state.annotationReducer.drawObjectStateById)
    .filter(([, value]) => value.isHidden === true)
    .map(([key]) => key);
export const selectorDrawObjectState = (id: string) => (state: RootState) =>
  state.annotationReducer.drawObjectStateById[id];
export const selectorDrawObjectStateById = (state: RootState) =>
  state.annotationReducer.drawObjectStateById;
export const selectorDetectedArea = (state: RootState) =>
  state.annotationReducer.detectedArea;
export const selectorDrawObject = (id: string) => (state: RootState) =>
  state.annotationReducer.drawObjectById[id];
export const selectorIsDraggingViewport = (state: RootState) =>
  state.annotationReducer.isDraggingViewport;
export const selectorDrawObjectStateIdByAI = (state: RootState) =>
  state.annotationReducer.drawObjectStateIdByAI;
export const selectorKeyDownInEditor = (state: RootState) =>
  state.annotationReducer.keyDownInEditor;
export const selectorMouseDownOutLayerPosition = (state: RootState) =>
  state.annotationReducer.mouseDownOutLayerPosition;
export const selectorMouseUpOutLayerPosition = (state: RootState) =>
  state.annotationReducer.mouseUpOutLayerPosition;
