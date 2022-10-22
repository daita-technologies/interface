import {
  EllipseSpec,
  PolygonSpec,
  RectangleSpec,
} from "components/Annotation/Editor/type";
import { RootState } from "reduxes";
import { DrawType } from "./type";

export const selectorcurrentDrawType = (state: RootState) =>
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
export const selectorZoom = (state: RootState) => state.annotationReducer.zoom;
export const selectorAnnotationHistoryStep = (state: RootState) =>
  state.annotationReducer.statehHistory.historyStep;
export const selectorAnnotationStatehHistory = (state: RootState) =>
  state.annotationReducer.statehHistory;
export const selectorListDrawObjectLock = (state: RootState) => {
  return Object.entries(state.annotationReducer.drawObjectStateById)
    .filter(([key, value]) => value.isLock === true)
    .map(([key, value]) => key);
};
export const selectorListDrawObjectHidden = (state: RootState) => {
  return Object.entries(state.annotationReducer.drawObjectStateById)
    .filter(([key, value]) => value.isHidden === true)
    .map(([key, value]) => key);
};
export const selectorDrawObjectState = (id: string) => (state: RootState) => {
  return state.annotationReducer.drawObjectStateById[id];
};
export const selectorDrawObjectStateById = (state: RootState) => {
  return state.annotationReducer.drawObjectStateById;
};
export const selectorDetectedArea = (state: RootState) => {
  return state.annotationReducer.detectedArea;
};
export const selectorDrawObject = (id: string) => (state: RootState) =>
  state.annotationReducer.drawObjectById[id];
export const selectorIsDraggingViewport = (state: RootState) =>
  state.annotationReducer.isDraggingViewport;
