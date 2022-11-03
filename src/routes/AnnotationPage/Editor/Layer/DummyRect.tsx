import { Layer } from "konva/lib/Layer";
import { Rect } from "react-konva";
import { useSelector } from "react-redux";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";

const DummyRect = ({ parentLayer }: { parentLayer: Layer | null }) => {
  const stage = parentLayer?.getStage();
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  if (stage && currentAnnotationFile) {
    const { width, height } = currentAnnotationFile;
    return <Rect width={width} height={height} />;
  }
  return <></>;
};
export default DummyRect;
