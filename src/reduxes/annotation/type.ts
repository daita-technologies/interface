import {
  DrawObjectType,
  LabelClassProperties,
} from "components/Annotation/Editor/type";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

export enum DrawType {
  RECTANGLE,
  POLYGON,
  ELLIPSE,
  LINE_STRIP,
  DETECTED_RECTANGLE,
}
export enum DrawState {
  DRAWING,
  SELECTING,
  FREE,
  DRAGGING,
  TRANSFORMING,
  ZOOMDRAGGING,
}
export interface DrawObject {
  type: DrawType;
  data: DrawObjectType;
}
export interface AnnotationReducer {
  currentDrawState: DrawState;
  currentDrawType: DrawType;
  selectedDrawObjectId: string | null;
  zoom: ZoomProps;
  drawObjectById: Record<string, DrawObject>;
  drawObjectStateById: Record<string, DrawObjectState>;
  statehHistory: StateHistory;
  detectedArea: DetectedAreaType | null;
}

export interface DetectedAreaType {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface DrawObjectState {
  isLock?: boolean;
  isHidden?: boolean;
}
export interface StateHistory {
  historyStep: number;
  stateHistoryItems: StateHistoryItem[];
}
export interface StateHistoryItem {
  drawObjectById: Record<string, DrawObject>;
}
export interface ControlPanelProp {
  drawType: DrawType;
  onChangeDrawType: (drawType: DrawType) => void;
  onResetScale: () => void;
}
export interface ChangeCurrentDrawTypePayload {
  currentDrawType: DrawType;
}
export interface ZoomProps {
  zoom: number;
  position: Vector2d;
}
export interface ChangeZoomPayload {
  zoom: ZoomProps;
}
export interface EditorEventPayload {
  eventObject: KonvaEventObject<MouseEvent>;
}
export interface CreateDrawObjectPayload {
  drawObject: DrawObject;
}
export interface UpdateDrawObjectPayload {
  data: DrawObjectType;
}
export interface ChangeCurrentDrawStatePayload {
  drawState: DrawState;
}
export interface SetSelectShapePayload {
  selectedDrawObjectId: string | null;
}
export interface DeleteDrawObjectPayload {
  drawObjectId: string;
}

export interface ResetCurrentStateDrawObjectPayload {
  drawObjectById: Record<string, DrawObject>;
}
export interface UpdateLabelOfDrawObjectPayload {
  drawObjectId: string;
  labelClassProperties: LabelClassProperties;
}
export interface SetHiddenDrawObjectPayload {
  drawObjectId: string;
  isHidden: boolean;
}
export interface SetLockDrawObecjtPayload {
  drawObjectId: string;
  isLock: boolean;
}
export interface SetLockDetectedAreaPayload {
  detectedArea: DetectedAreaType | null;
}