import { Label, LabelAttribute } from "components/Annotation/Editor/type";
import { DrawObject } from "reduxes/annotation/type";

export interface ClassLabelProps {
  drawObject: DrawObject;
}

export interface LabelAttributesProps {
  attributes?: LabelAttribute[];
  isEnable: boolean;
  onChangeAttribute: (attributes: LabelAttribute[]) => void;
}
export interface LabelForm {
  color: string;
  label: string;
  attributes: LabelAttribute[];
}
