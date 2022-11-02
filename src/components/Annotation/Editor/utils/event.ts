import { Layer } from "konva/lib/Layer";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { ScaleResult } from "../type";
const scaleBy = 1.2;

export function getNewPositionOnWheel(
  e: KonvaEventObject<WheelEvent>,
  obj: Layer,
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
