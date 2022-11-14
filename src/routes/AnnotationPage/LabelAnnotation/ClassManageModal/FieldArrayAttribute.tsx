import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, TextField } from "@mui/material";
import { MyButton } from "components";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { LabelForm } from "../ClassLabel/type";

export default function FieldArrayAttribute({
  control,
  register,
}: {
  control: Control<LabelForm, any>;
  register: UseFormRegister<LabelForm>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });
  const handleRemoveAttribute = (index: number) => {
    remove(index);
  };
  const handleCreateAttribute = () => {
    append({ key: "key", value: "value" });
  };
  return (
    <Box display="flex" flexDirection="column" pl={10} gap={2}>
      <Box display="flex" alignItems="flex-end" flexDirection="column" gap={2}>
        {fields.map((item, index) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="flex-end"
            width="100%"
            gap={1}
          >
            <TextField
              {...register(`attributes.${index}.key`)}
              fullWidth
              margin="dense"
              id="attribute-name"
              label="Attribute namne"
              type="text"
              variant="standard"
            />
            <TextField
              {...register(`attributes.${index}.value`)}
              fullWidth
              margin="dense"
              id="attribute-value"
              label="value"
              type="text"
              variant="standard"
            />
            <IconButton onClick={() => handleRemoveAttribute(index)}>
              <ClearIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <MyButton
        variant="contained"
        color="primary"
        onClick={handleCreateAttribute}
      >
        Create new attribute
      </MyButton>
    </Box>
  );
}
