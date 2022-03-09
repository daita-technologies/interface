import { Control, UseFormRegister } from "react-hook-form";

export interface ReCaptchaInputProps {
  recaptchaRef?: React.RefObject<any>;
  control: Control<any>;
  register: UseFormRegister<any>;
}
