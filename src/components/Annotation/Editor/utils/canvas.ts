import {
  MAX_HEIGHT_IMAGE_IN_EDITOR,
  MAX_WIDTH_IMAGE_IN_EDITOR,
} from "../const";

export const getAvaragePoint = (points: number[]) => {
  let totalX = 0;
  let totalY = 0;
  for (let i = 0; i < points.length; i += 2) {
    totalX += points[i];
    totalY += points[i + 1];
  }
  return {
    x: totalX / (points.length / 2),
    y: totalY / (points.length / 2),
  };
};
export const getDistance = (node1: number[], node2: number[]) => {
  const diffX = Math.abs(node1[0] - node2[0]);
  const diffY = Math.abs(node1[1] - node2[1]);
  const distaneInPixel = Math.sqrt(diffX * diffX + diffY * diffY);
  return Number.parseFloat(`${distaneInPixel}`).toFixed(2);
};
export const dragBoundFunc = (
  stageWidth: number,
  stageHeight: number,
  vertexRadius: number,
  pos: { x: number; y: number }
) => {
  let { x, y } = pos;
  if (pos.x + vertexRadius > stageWidth) x = stageWidth;
  if (pos.x - vertexRadius < 0) x = 0;
  if (pos.y + vertexRadius > stageHeight) y = stageHeight;
  if (pos.y - vertexRadius < 0) y = 0;
  return { x, y };
};
export const minMax = (points: number[]) =>
  points.reduce((acc: number[], val: number) => {
    acc[0] = acc[0] === undefined || val < acc[0] ? val : acc[0];
    acc[1] = acc[1] === undefined || val > acc[1] ? val : acc[1];
    return acc;
  }, []);

export const getScaleImageDemensionInEditor = (
  realWidth: number,
  realHeight: number
) => {
  let newHeight = realHeight;
  let newWidth = realWidth;
  if (realWidth > MAX_WIDTH_IMAGE_IN_EDITOR) {
    newHeight *= MAX_WIDTH_IMAGE_IN_EDITOR / newWidth;
    newWidth = MAX_WIDTH_IMAGE_IN_EDITOR;
  }
  if (newHeight > MAX_HEIGHT_IMAGE_IN_EDITOR) {
    newWidth *= MAX_HEIGHT_IMAGE_IN_EDITOR / newHeight;
    newHeight = MAX_HEIGHT_IMAGE_IN_EDITOR;
  }
  return { newWidth, newHeight };
};
