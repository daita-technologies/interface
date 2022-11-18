import { Layer } from "konva/lib/Layer";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import {
  MAX_HEIGHT_IMAGE_IN_EDITOR,
  MAX_WIDTH_IMAGE_IN_EDITOR,
} from "../const";
import { ScaleResult } from "../type";

const scaleBy = 1.2;

export function getNewPositionOnWheel(
  e: KonvaEventObject<WheelEvent>,
  obj: Layer | Stage,
  pointer: Vector2d
): ScaleResult {
  e.evt.preventDefault();
  const oldScale = obj.scaleX();
  const mousePointTo = {
    x: (pointer.x - obj.x()) / oldScale,
    y: (pointer.y - obj.y()) / oldScale,
  };

  let direction = e.evt.deltaY > 0 ? 1 : -1;

  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  const newPosition: Vector2d = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  return { newPosition, newScale };
}
export function getFitScaleEditor(width: number, height: number) {
  const widthRatio = MAX_WIDTH_IMAGE_IN_EDITOR / width;
  const heightRatio = MAX_HEIGHT_IMAGE_IN_EDITOR / height;
  let newWidth = width;
  if (widthRatio < 1 || heightRatio < 1) {
    if (widthRatio < heightRatio) {
      newWidth = MAX_WIDTH_IMAGE_IN_EDITOR;
    } else {
      newWidth *= heightRatio;
    }
  }
  return newWidth / width;
}
