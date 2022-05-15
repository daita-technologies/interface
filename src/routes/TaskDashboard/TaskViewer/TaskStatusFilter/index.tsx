import { Autocomplete, Box, TextField } from "@mui/material";
import {
  CANCEL_TASK_STATUS,
  ERROR_TASK_STATUS,
  FILTER_ALL_TASK_STATUS,
  FINISH_TASK_STATUS,
  RUNNING_TASK_STATUS,
} from "constants/defaultValues";
import { TaskStatusFilterOption, TaskStatusFilterProps } from "./type";

const TASK_STATUS_FILTER_OPTION_ARRAY: TaskStatusFilterOption[] = [
  {
    value: FILTER_ALL_TASK_STATUS,
    label: "All",
  },
  {
    value: RUNNING_TASK_STATUS,
    label: "Running",
  },
  {
    value: FINISH_TASK_STATUS,
    label: "Finish",
  },
  {
    value: ERROR_TASK_STATUS,
    label: "Error",
  },
  {
    value: CANCEL_TASK_STATUS,
    label: "Cancel",
  },
];

function TaskStatusFilter({ onChange }: TaskStatusFilterProps) {
  return (
    <Box pt={1} pb={3}>
      <Autocomplete
        disablePortal
        // id="combo-box-demo"
        options={TASK_STATUS_FILTER_OPTION_ARRAY}
        sx={{ width: 300 }}
        onChange={(_, value) => {
          if (value) {
            onChange(value);
          }
        }}
        placeholder="Status"
        renderInput={(params) => (
          <TextField {...params} label="Status" size="small" />
        )}
        defaultValue={
          {
            value: FILTER_ALL_TASK_STATUS,
            label: "All",
          } as TaskStatusFilterOption
        }
      />
    </Box>
  );
}

export default TaskStatusFilter;
