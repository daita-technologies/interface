import { Label, LabelAttribute } from "components/Annotation/Editor/type";
import { DrawObject } from "reduxes/annotation/type";

export interface ClassLabelProps {
  drawObject: DrawObject;
}

export interface LabelAttributesProps {
  attributes?: LabelAttribute[];
  onChangeAttribute: (attributes: LabelAttribute[]) => void;
}
export interface AddLabelForm {
  color: string;
  label: string;
}
