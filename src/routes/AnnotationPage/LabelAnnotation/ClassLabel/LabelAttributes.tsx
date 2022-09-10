import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, TextField } from "@mui/material";
import { MyButton } from "components";
import { LabelAttribute } from "components/Annotation/Editor/type";
import { useEffect, useState } from "react";
import { LabelAttributesProps } from "./type";

const LabelAttributes = function (labelAttributesProps: LabelAttributesProps) {
  const [attributes, setAttributes] = useState<LabelAttribute[]>(
    labelAttributesProps.attributes ? labelAttributesProps.attributes : []
  );
  useEffect(() => {
    labelAttributesProps.onChangeAttribute(attributes);
  }, [attributes]);

  const handleRemoveAttribute = (index: number) => {
    attributes.splice(index, 1);
    setAttributes([...attributes]);
  };
  const handleCreateAttribute = () => {
    attributes.push({ key: "", value: "" });
    setAttributes([...attributes]);
    console.log(attributes);
  };
  const handleChangeAttributeName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    attributes[index].key = e.target.value;
    setAttributes([...attributes]);
  };
  const handleChangeAttributeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    attributes[index].value = e.target.value;
    setAttributes([...attributes]);
  };
  return (
    <Box display="flex" flexDirection="column" p={2} gap={3}>
      <Box display="flex" alignItems="flex-end" flexDirection="column" gap={2}>
        {attributes.map((attribute, index) => {
          return (
            <Box
              key={index}
              display="flex"
              alignItems="flex-end"
              width="100%"
              gap={1}
            >
              <TextField
                fullWidth
                autoFocus
                margin="dense"
                id="attribute-name"
                value={attribute.key}
                label="Attribute namne"
                onChange={(e) => handleChangeAttributeName(e, index)}
                type="text"
                variant="standard"
              />
              <TextField
                fullWidth
                margin="dense"
                id="attribute-value"
                value={attribute.value}
                label="value"
                onChange={(e) => handleChangeAttributeValue(e, index)}
                type="text"
                variant="standard"
              />
              <IconButton onClick={() => handleRemoveAttribute(index)}>
                <ClearIcon />
              </IconButton>
            </Box>
          );
        })}
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
};

export default LabelAttributes;
