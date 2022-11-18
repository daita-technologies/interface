import { useEffect, useState } from "react";
import { Image } from "react-konva";
import { useSelector } from "react-redux";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";

export default function BaseImage() {
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (currentAnnotationFile) {
      const element = new window.Image();
      element.src = URL.createObjectURL(currentAnnotationFile.image);
      setImage(element);
    }
  }, [currentAnnotationFile]);

  return (
    <Image
      image={image}
      width={currentAnnotationFile?.width}
      height={currentAnnotationFile?.height}
    />
  );
}
