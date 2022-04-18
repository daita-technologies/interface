import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { SliderInputProps } from "./type";
import { generalSlideDataSx, splitDataWrapperSx } from "./style";

const SliderInput = function ({ dataForm, total, onChange }: SliderInputProps) {
  const { training, validation } = dataForm;
  const [value, setValue] = React.useState<number[]>([
    training,
    training + validation,
  ]);
  const preTraining = value[0];
  const preValidation = value[1] - value[0];

  React.useEffect(() => {
    if (training !== preTraining || validation !== preValidation) {
      setValue([training, training + validation]);
    }
  }, [dataForm]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== "number") {
      onChange({
        training: newValue[0],
        validation: newValue[1] - newValue[0],
        test: total - newValue[1],
      });
      setValue(newValue as number[]);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        ".MuiSlider-rail": {
          color: preTraining || preValidation ? "transparent" : undefined,
        },
      }}
    >
      <Box sx={splitDataWrapperSx}>
        <Box
          sx={{
            ...generalSlideDataSx,
            backgroundColor: "#55657d",
            width: `${Math.floor((preTraining * 100) / total)}%`,
          }}
        />
        <Box
          sx={{
            ...generalSlideDataSx,
            backgroundColor: "#2f3c51",
            width: `${Math.floor((preValidation * 100) / total)}%`,
          }}
        />
        <Box
          sx={{
            ...generalSlideDataSx,
            backgroundColor: "#101824",
            width: `${Math.floor(
              ((total - preTraining - preValidation) * 100) / total
            )}%`,
          }}
        />
      </Box>
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
