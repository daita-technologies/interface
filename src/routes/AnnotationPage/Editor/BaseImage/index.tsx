import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Image } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { setClientRectOfBaseImage } from "reduxes/annotationmanager/action";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selector";

export default function BaseImage() {
  const dispatch = useDispatch();
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const [image, setImage] = useState<HTMLImageElement>();
  const ref = useRef<Konva.Image | null>(null);

  useEffect(() => {
    if (currentAnnotationFile) {
      const element = new window.Image();
      element.src = URL.createObjectURL(currentAnnotationFile.image);
      setImage(element);
    }
  }, [currentAnnotationFile]);
  useEffect(() => {
    if (image && ref.current) {
      dispatch(
        setClientRectOfBaseImage({
          clientRectOfBaseImage: ref.current.getClientRect(),
        })
      );
    }
  }, [image]);

  return (
    <Image
      ref={ref}
      image={image}
      width={currentAnnotationFile?.width}
      height={currentAnnotationFile?.height}
    />
  );
}
