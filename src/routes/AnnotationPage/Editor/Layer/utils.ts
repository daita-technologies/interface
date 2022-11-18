/* eslint-disable import/prefer-default-export */
import { Vector2d } from "konva/lib/types";

export const adjustPosition = (
  position: Vector2d,
  limitWidth?: number,
  limitHeight?: number
) => {
  if (limitWidth && limitHeight) {
    const newPosition = { ...position };
    if (position.x < 0) {
      newPosition.x = 0;
    }
    if (position.x > limitWidth) {
      newPosition.x = limitWidth;
    }
    if (position.y < 0) {
      newPosition.y = 0;
    }
    if (position.y > limitHeight) {
      newPosition.y = limitHeight;
    }
    return newPosition;
  }
  return position;
};
