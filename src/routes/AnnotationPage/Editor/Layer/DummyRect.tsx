import { Rect } from "react-konva";
import { useSelector } from "react-redux";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";

const DummyRect = () => {
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  if (currentAnnotationFile) {
    const { width, height } = currentAnnotationFile;
    return <Rect width={width} height={height} />;
  }
  return <></>;
};
export default DummyRect;
