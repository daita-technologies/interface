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
    if (shape.type === DrawType.POLYGON || shape.type === DrawType.LINE_STRIP) {
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
    if (shape.type === DrawType.RECTANGLE) {
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
    if (shape.type === DrawType.ELLIPSE) {
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
