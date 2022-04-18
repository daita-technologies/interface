import {
  TEST_DATA_NUMBER_INDEX,
  TRAINING_DATA_NUMBER_INDEX,
  VALIDATION_DATA_NUMBER_INDEX,
} from "constants/defaultValues";
import { Control, UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface DataSetSplitProps {
  //
}

export type SPLIT_DATA_TYPE =
  | typeof TRAINING_DATA_NUMBER_INDEX
  | typeof VALIDATION_DATA_NUMBER_INDEX
  | typeof TEST_DATA_NUMBER_INDEX;

export interface SplitDataNumberBoxProps {
  splitDataType: SPLIT_DATA_TYPE;
  splitValue: number;
  total: number;
  isEditing: boolean;
  control: Control<any>;
  name: string;
  isInitialSplit: boolean;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}

export interface SplitDataFormFields {
  training: number;
  validation: number;
  test: number;
}
export interface SliderInputProps {
  dataForm: SplitDataFormFields;
  total: number;
  onChange: (dataForm: SplitDataFormFields) => void;
}
