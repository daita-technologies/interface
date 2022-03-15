import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { SliderInputProps } from "./type";

const SliderInput = function ({ dataForm, total, onChange }: SliderInputProps) {
  const { training, validation, test } = dataForm;
  const [value, setValue] = React.useState<number[]>([
    training,
    training + validation,
  ]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
    } else {
      onChange({
        training: newValue[0],
        validation: newValue[1] - newValue[0],
        test: total - newValue[1],
      });
      setValue(newValue as number[]);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        track={false}
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        max={total}
        disableSwap
      />
    </Box>
  );
};
export default SliderInput;
