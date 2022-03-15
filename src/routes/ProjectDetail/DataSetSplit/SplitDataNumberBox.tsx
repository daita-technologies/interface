import { Box, Input, Typography } from "@mui/material";
import {
  TEST_DATA_NUMBER_INDEX,
  TRAINING_DATA_NUMBER_INDEX,
  VALIDATION_DATA_NUMBER_INDEX,
} from "constants/defaultValues";
import { useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { separateNumber } from "utils/general";
import { SplitDataNumberBoxProps, SPLIT_DATA_TYPE } from "./type";

const getName = (splitDataType: SPLIT_DATA_TYPE) => {
  switch (splitDataType) {
    case TRAINING_DATA_NUMBER_INDEX:
      return "Training";
    case VALIDATION_DATA_NUMBER_INDEX:
      return "Validation";
    case TEST_DATA_NUMBER_INDEX:
      return "Test";

    default:
      return "";
  }
};

const getBgColor = (splitDataType: SPLIT_DATA_TYPE) => {
  switch (splitDataType) {
    case TRAINING_DATA_NUMBER_INDEX:
      return "#55657d";
    case VALIDATION_DATA_NUMBER_INDEX:
      return "#2f3c51";
    case TEST_DATA_NUMBER_INDEX:
      return "#101824";

    default:
      return "#55657d";
  }
};

const SplitDataNumberBox = function ({
  splitValue,
  total,
  splitDataType,
  isEditing,
  control,
  name,
  isInitialSplit,
  setValue,
  getValues,
}: SplitDataNumberBoxProps) {
  const bgColor = useMemo(() => getBgColor(splitDataType), [splitDataType]);
  const splitType = useMemo(() => getName(splitDataType), [splitDataType]);
  const percent =
    total === 0
      ? 0
      : (((isEditing ? getValues(name) : splitValue) / total) * 100).toFixed(0);
  useEffect(() => {
    if (setValue) {
      setValue(name, splitValue);
    }
  }, [splitValue]);

  return (
    <Box
      sx={{ backgroundColor: bgColor }}
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      flex={!isInitialSplit ? 1 : undefined}
      width={percent === 0 ? undefined : `${percent}%`}
    >
      <Typography variant="body2" noWrap>
        {splitType}
      </Typography>

      {!isEditing && (
        <Typography sx={{ mt: 1 }} variant="body2" noWrap>
          {separateNumber(splitValue.toString())}
        </Typography>
      )}

      <Controller
        control={control}
        name={name}
        rules={{
          min: {
            value: 0,
            message: "Input values must be greater than or equal 0",
          },
        }}
        render={({ field, fieldState }) => (
          <Box
            display={!isEditing ? "none" : "inline-flex"}
            flexDirection="column"
          >
            <Input
              sx={{
                input: {
                  textAlign: "center",
                  fontSize: 14,
                  minWidth: 70,
                  display: !isEditing ? "none" : "inline-flex",
                },
                mt: 1,
              }}
              error={!!fieldState.error}
              inputProps={{ min: 0, max: total || 0 }}
              value={field.value}
              onChange={field.onChange}
              type="number"
            />
          </Box>
        )}
      />
    </Box>
  );
};

export default SplitDataNumberBox;
