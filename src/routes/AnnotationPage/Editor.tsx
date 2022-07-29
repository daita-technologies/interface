import Box from "@mui/material/Box";
import { getNewPositionOnWheel } from "components/Annotation/Editor/utils";
import { KonvaEventObject } from "konva/lib/Node";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Group, Image, Layer, Rect, Stage, Text } from "react-konva";

import { Polygon } from "components/Annotation";
import { LINE_STYLE } from "components/Annotation/Editor/const";
import {
  initialPolygons,
  initialRectangles,
  PolygonSpec,
  RectangleSpec,
} from "components/Annotation/Editor/type";
import Konva from "konva";
import { useSelector } from "react-redux";
import { selectorcurrentDrawType } from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";
import useImage from "use-image";
import { Vector2d } from "konva/lib/types";
const Editor = () => {};
// const Editor = () => {
//   const drawType = useSelector(selectorcurrentDrawType);

//   const [isNowDrawing, setIsNowDrawing] = useState(false);
//   const imageRef = useRef<Konva.Image | null>(null);
//   const layer = useRef<Konva.Layer | null>(null);
//   const group = useRef<Konva.Group | null>(null);
//   const stageRef = useRef<Konva.Stage | null>(null);
//   const [currentRectId, setCurrentRectId] = useState<string>();
//   const [transforming, setTransforming] = useState(false);
//   const [rectangles, setRectangles] = useState<RectangleSpec[]>([]);
//   const [selectShapeId, setSelectShapeId] = useState<string | null>(null);
//   const [position, setPosition] = useState<Vector2d>({ x: 0, y: 0 });
//   const [keyDown, setKeyDown] = useState<string | null>();
//   const refBoundDiv = useRef<HTMLDivElement | null>(null);
//   const [polygons, setPolygons] =
//     useState<Record<string, PolygonSpec>>(initialPolygons);
//   const [image] = useImage(
//     "https://f6-zpcloud.zdn.vn/7198882725419606626/7b6aef0eee3e2c60752f.jpg"
//   );
//   const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
//     if (transforming) return;
//     if (drawType === DrawType.RECTANGLE) {
//       if (!isNowDrawing || !group.current) return;
//       const position = group.current?.getRelativePointerPosition();
//       const indexOf = rectangles.findIndex((t) => t.id === currentRectId);
//       if (indexOf !== -1) {
//         const newWidth = position.x - rectangles[indexOf].x;
//         const newHeight = position.y - rectangles[indexOf].y;
//         rectangles[indexOf].width = newWidth;
//         rectangles[indexOf].height = newHeight;
//         setRectangles([...rectangles]);
//       }
//     } else if (drawType === DrawType.POLYGON) {
//       // const stage = e.target.getStage();
//       const pos = imageRef.current?.getRelativePointerPosition();
//       if (pos) {
//         const mousePos = { x: pos.x, y: pos.y };
//         setPosition(mousePos);
//       }
//     }
//   };

//   const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
//     console.log(
//       "Stage mousedownHandler",
//       { transforming },
//       { selectShapeId },
//       { isDraggableStage }
//     );

//     if (
//       drawType === DrawType.RECTANGLE &&
//       (selectShapeId || transforming || isDraggableStage)
//     ) {
//       return;
//     }
//     if (drawType === DrawType.POLYGON && (transforming || isDraggableStage)) {
//       return;
//     }
//     if (drawType === DrawType.RECTANGLE) {
//       console.log("transforming");
//       setIsNowDrawing(true);
//       const position = e.target.getRelativePointerPosition();
//       if (!position) return;
//       const id = `RECTANGLE-${Math.floor(Math.random() * 100000)}`;
//       const tempRect: RectangleSpec = {
//         x: position.x,
//         y: position.y,
//         width: 0,
//         height: 0,
//         id: id,
//         label: { label: id },
//         ...LINE_STYLE,
//       };
//       setRectangles([...rectangles, tempRect]);
//       setCurrentRectId(tempRect.id);
//     } else if (drawType === DrawType.POLYGON) {
//       const position = e.target.getRelativePointerPosition();
//       if (!position) return;
//       let polygon: PolygonSpec;
//       const point = { x: position.x, y: position.y };
//       console.log("!currentPolygonId", !selectShapeId, selectShapeId);

//       if (!selectShapeId) {
//         const id = `POLYGON-${Math.floor(Math.random() * 100000)}`;
//         polygon = {
//           id: id,
//           points: [point],
//           isFinished: false,
//           label: { label: id },
//         };
//         console.log("init polygon");
//         setSelectShapeId(polygon.id);
//       } else {
//         console.log("add point", point);
//         polygon = polygons[selectShapeId];
//         if (polygon.isFinished) {
//           return;
//         }
//         polygon.points = [...polygon.points, point];
//       }
//       updatePolygon(polygon);
//     }
//   };
//   const mouseupHandler = () => {
//     if (drawType === DrawType.RECTANGLE) {
//       setIsNowDrawing(false);
//     }
//   };

//   const handlePointDragMove = (
//     e: KonvaEventObject<DragEvent>,
//     polygon: PolygonSpec
//   ) => {
//     if (drawType === DrawType.POLYGON) {
//       const { points } = polygon;
//       const stage = e.target.getStage();
//       if (stage) {
//         const index = e.target.index - 1;
//         const pos = { x: e.target._lastPos.x, y: e.target._lastPos.y };
//         if (pos.x < 0) pos.x = 0;
//         if (pos.y < 0) pos.y = 0;
//         if (pos.x > stage.width()) pos.x = stage.width();
//         if (pos.y > stage.height()) pos.y = stage.height();
//         polygon.points = [
//           ...points.slice(0, index),
//           pos,
//           ...points.slice(index + 1),
//         ];
//         console.log("update Polygon", polygon);
//         updatePolygon(polygon);
//       }
//     }
//   };

//   const handleGroupDragEnd = (
//     e: KonvaEventObject<DragEvent>,
//     polygon: PolygonSpec
//   ) => {
//     if (e.target.name() === "polygon") {
//       const result: Vector2d[] = [];
//       let copyPoints = [...polygon.points];
//       const x: number = e.target.x();
//       const y: number = e.target.y();
//       console.log("handleGroupDragEnd", { x, y });

//       copyPoints.map((point) =>
//         result.push({ x: point.x + x, y: point.y + y })
//       );
//       e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)

//       polygon.points = result;
//       setPolygons({ ...polygons, [polygon.id]: { ...polygon } });
//       setTransforming(false);
//     }
//   };
//   const clickStageHandler = (e: KonvaEventObject<MouseEvent>) => {
//     setSelectShapeId(null);
//   };

//   const wheelHandler = (e: KonvaEventObject<WheelEvent>) => {
//     e.evt.preventDefault();
//     const ref = layer;
//     if (
//       !ref?.current ||
//       !e.evt.ctrlKey ||
//       !stageRef?.current ||
//       !stageRef.current.getPointerPosition()
//     ) {
//       return;
//     }

//     const points = stageRef.current.getPointerPosition();
//     if (points) {
//       const { newPosition, newScale } = getNewPositionOnWheel(
//         e,
//         ref.current,
//         points
//       );
//       if (newScale <= 1) return;
//       ref.current.scale({ x: newScale, y: newScale });
//       ref.current.position(newPosition);
//     }
//   };

//   const keyUpHandler = (): void => {
//     setKeyDown(null);
//   };
//   const keyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
//     setKeyDown(e.key);
//   };
//   const isDraggableStage = useMemo(() => {
//     return keyDown === " " ? true : false;
//   }, [keyDown]);
//   const mouseOverBoundDivHandler = () => {
//     refBoundDiv.current?.focus();
//   };

//   const updatePolygon = (polygon: PolygonSpec) => {
//     setPolygons({
//       ...polygons,
//       [polygon.id]: { ...polygon },
//     });
//   };
//   // useEffect(() => {
//   //   const ref = layer;
//   //   ref.current?.scale({ x: 3, y: 3 });
//   //   ref.current?.position({ x: 0, y: 0 });
//   // }, []);
//   const toolTipLayer = useRef<Konva.Layer>(null);
//   const toolTip = useRef<Konva.Text>(null);
//   const toolTipRect = useRef<Konva.Rect>(null);

//   const onMouseOverToolTipHandler = (
//     e: KonvaEventObject<MouseEvent>,
//     shape: PolygonSpec | RectangleSpec
//   ) => {
//     if (layer?.current && toolTipLayer.current && toolTip.current) {
//       const mousePos = layer.current.getRelativePointerPosition();
//       toolTipLayer.current.position({
//         x: mousePos.x + 5,
//         y: mousePos.y + 5,
//       });
//       toolTip.current.text(`LABEL ${shape.label.label}`);
//       toolTipLayer.current.show();
//     }
//   };
//   const onMouseOutToolTipHandler = () => {
//     if (layer?.current && toolTipLayer.current && toolTip.current) {
//       console.log("onMouseOUTToolTipHandler");

//       toolTipLayer.current.hide();
//     }
//   };
//   return (
//     <>
//       <Box sx={{ padding: "40px 20px" }}>
//         <Box display="flex" gap={3}>
//           <Box>
//             <div
//               ref={refBoundDiv}
//               tabIndex={0}
//               onKeyDown={keyDownHandler}
//               onKeyUp={keyUpHandler}
//               onMouseOver={mouseOverBoundDivHandler}
//             >
//               <Stage ref={stageRef} width={1200} height={700}>
//                 <Layer ref={layer}>
//                   <Group
//                     ref={group}
//                     onClick={clickStageHandler}
//                     onWheel={wheelHandler}
//                     onMouseMove={mousemoveHandler}
//                     onMouseDown={mousedownHandler}
//                     onMouseUp={mouseupHandler}
//                     draggable={isDraggableStage}
//                   >
//                     <Image
//                       ref={imageRef}
//                       image={image}
//                       x={0}
//                       y={0}
//                       width={image && image?.width > 1200 ? 1200 : image?.width}
//                       height={
//                         image && image?.width > 1200
//                           ? image.height * (1200 / image.width)
//                           : image?.height
//                       }
//                     />
//                     {rectangles
//                       .filter((t) => t.width != 0)
//                       .map((rect, i) => {
//                         return (
//                           <Rectangle
//                             key={rect.id}
//                             rectangleSpec={rect}
//                             isSelected={rect.id === selectShapeId}
//                             onSelect={(e: KonvaEventObject<MouseEvent>) => {
//                               setSelectShapeId(rect.id);
//                             }}
//                             onChange={(newAttrs) => {
//                               const rects = rectangles.slice();
//                               rects[i] = newAttrs;
//                               setRectangles(rects);
//                             }}
//                             handleTransformStart={() => setTransforming(true)}
//                             handleTransformEnd={() => setTransforming(false)}
//                             onMouseOverHandler={(e) =>
//                               onMouseOverToolTipHandler(e, rect)
//                             }
//                             onMouseOutHandler={onMouseOutToolTipHandler}
//                           />
//                         );
//                       })}
//                     {Object.entries(polygons).map(([key, polygon]) => {
//                       return (
//                         <Polygon
//                           key={key}
//                           position={polygon.isFinished ? null : position}
//                           polygon={polygon}
//                           onSelect={(e: KonvaEventObject<MouseEvent>) => {
//                             console.log("setSelectShapeId", polygon.id);
//                             setSelectShapeId(polygon.id);
//                           }}
//                           onDragStart={() => {
//                             setTransforming(true);
//                           }}
//                           handlePointDragMove={(e) =>
//                             handlePointDragMove(e, polygon)
//                           }
//                           handleGroupDragEnd={(e) =>
//                             handleGroupDragEnd(e, polygon)
//                           }
//                           handleDragEnd={(e) => setTransforming(false)}
//                           updatePolygon={(polygon) => {
//                             console.log("updatePolygon", polygon);
//                             if (polygon.isFinished === true) {
//                               console.log(
//                                 "updatePolygon Update Finish",
//                                 polygon
//                               );
//                               setSelectShapeId(null);
//                             }
//                             updatePolygon(polygon);
//                           }}
//                           isSelect={selectShapeId === polygon.id}
//                           onMouseOverHandler={(e) => {
//                             onMouseOverToolTipHandler(e, polygon);
//                           }}
//                           onMouseOutHandler={onMouseOutToolTipHandler}
//                         />
//                       );
//                     })}
//                   </Group>
//                 </Layer>
//                 <Layer ref={toolTipLayer} visible={false}>
//                   <Rect
//                     ref={toolTipRect}
//                     x={0}
//                     y={0}
//                     stroke={"#555"}
//                     strokeWidth={2}
//                     fill={"#ddd"}
//                     width={200}
//                     height={40}
//                     // opacity={0.9}
//                     // shadowOpacity={0.9}
//                     // cornerRadius={10}
//                   />
//                   <Text
//                     align="center"
//                     width={200}
//                     height={40}
//                     fontSize={15}
//                     padding={14}
//                     ref={toolTip}
//                   />
//                 </Layer>
//               </Stage>
//             </div>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };

export default Editor;
