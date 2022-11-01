import { UseFormReturn } from "react-hook-form";
import { LabelForm } from "../ClassLabel/type";

export interface ClassManageItemProps {
  form: UseFormReturn<LabelForm, any>;
}
export interface ClassManageDialogProps {
  title: string;
  content: JSX.Element;
  action: JSX.Element;
}
