import CancelIcon from "@mui/icons-material/Cancel";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { Box, IconButton, Modal, Popover, Typography } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { MyButton } from "components";
import {
  Label,
  LabelAttribute,
  LabelClassProperties,
} from "components/Annotation/Editor/type";
import * as React from "react";
import { useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateLabelOfDrawObject } from "reduxes/annotation/action";
import { addNewClassLabel } from "reduxes/annotationmanager/action";
import { selectorLabelClassPropertiesByLabelClass } from "reduxes/annotationmanager/selecetor";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import LabelAttributes from "./LabelAttributes";
import { AddLabelForm, ClassLabelProps } from "./type";

const filter = createFilterOptions<LabelClassPropertiesOptionType>();

export const convertStrokeColorToFillColor = (color: string) => {
  if (color && color.length > 1) {
    return color + "33";
  }
  return "";
};
const opptionType2LabelClassProperties = (
  label: string,
  color: string
): LabelClassProperties => {
  return {
    label: { label: label },
    cssStyle: {
      fill: convertStrokeColorToFillColor(color),
      stroke: color,
    },
  };
};
const ClassLabel = function ({ drawObject }: ClassLabelProps) {
  const dispatch = useDispatch();
  const [open, toggleOpen] = useState(false);
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddLabelForm>({
    mode: "onChange",
    defaultValues: {
      color: "#1abbcc",
      label: "",
    },
  });
  const handleClose = () => {
    toggleOpen(false);
  };

  const onSubmitLabelPropeties: SubmitHandler<AddLabelForm> = (data) => {
    const attr = attributes.find((attribute) => {
      return !!attribute.key || !!attribute.value;
    });
    if (attributes.length !== 0 && !attr) {
      toast.error("Attributes of label class can not empty");
      return;
    }

    const labelClassProperties = opptionType2LabelClassProperties(
      getValues("label"),
      getValues("color")
    );
    if (labelClassProperties) {
      labelClassProperties.label.attributes = attributes;
      dispatch(addNewClassLabel({ labelClassProperties }));
      handleChangeClassLabel(getValues("label"));
      handleClose();
    }
  };
  const handleChangeColor = (newColor: string) => {
    setValue("color", newColor);
  };

  const handleClickShowPickColor = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePickColor = () => {
    setAnchorEl(null);
  };
  const listLabelClassProperties: LabelClassPropertiesOptionType[] =
    React.useMemo(() => {
      return Object.entries(labelClassPropertiesByLabelClass).map(
        ([key, value]) => {
          return {
            inputValue: "",
            color: value.cssStyle.stroke,
            label: value.label,
          };
        }
      ) as LabelClassPropertiesOptionType[];
    }, [labelClassPropertiesByLabelClass]);
  const openPickColor = Boolean(anchorEl);
  const id = open ? "popover" : undefined;
  const renderPickColor = () => {
    return (
      <Popover
        id={id}
        open={openPickColor}
        anchorEl={anchorEl}
        onClose={handleClosePickColor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <HexColorPicker
          color={getValues("color")}
          onChange={handleChangeColor}
        />
      </Popover>
    );
  };

  const handleChangeClassLabel = (label: string) => {
    let properties = labelClassPropertiesByLabelClass[label];
    if (!properties) {
      properties = opptionType2LabelClassProperties(
        getValues("label"),
        getValues("color")
      );
    }
    dispatch(
      updateLabelOfDrawObject({
        drawObjectId: drawObject.data.id,
        labelClassProperties: properties,
      })
    );
  };
  const labelClassProperties: LabelClassPropertiesOptionType | null =
    useMemo(() => {
      const label =
        labelClassPropertiesByLabelClass[drawObject.data?.label?.label];
      if (label) {
        return {
          label: label.label,
          color: label.cssStyle.stroke,
        } as LabelClassPropertiesOptionType;
      }
      return null;
    }, [labelClassPropertiesByLabelClass, drawObject]);
  const [attributes, setAttributes] = useState<LabelAttribute[]>([]);
  const handleChangeAttribute = (attributesProps: LabelAttribute[]) => {
    setAttributes([...attributesProps]);
  };
  return (
    <React.Fragment>
      <Autocomplete
        value={labelClassProperties}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setTimeout(() => {
              toggleOpen(true);
              setValue("label", newValue);
              setValue("color", "");
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setValue("label", newValue.inputValue);
            setValue("color", "");
          } else {
            if (newValue) {
              handleChangeClassLabel(newValue.label.label);
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              label: { label: `Add "${params.inputValue}"` },
              color: "",
            });
          }

          return filtered;
        }}
        options={listLabelClassProperties}
        getOptionLabel={(option) => {
          if (!option || !option.label) {
            return "";
          }
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.label.label;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>{option.label.label}</li>
        )}
        sx={{ maxWidth: 180 }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} size="small" variant="standard" />
        )}
      />
      <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
        <Box sx={{ ...modalStyle, width: 600 }}>
          <IconButton sx={modalCloseStyle} onClick={handleClose}>
            <CancelIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4" component="h2">
            Add a new class
          </Typography>
          <Box marginTop={6}>
            <form onSubmit={handleSubmit(onSubmitLabelPropeties)}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="flex-end" width="100%">
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    required
                    {...register("label", {
                      required: true,
                      maxLength: {
                        value: 25,
                        message: `Your class name cannot exceed 25 characters.`,
                      },
                    })}
                    error={!!errors.label}
                    helperText={(errors.label && errors.label.message) || ""}
                    label="Class name"
                    type="text"
                    variant="standard"
                  />
                  <IconButton
                    sx={{ backgroundColor: getValues("color") }}
                    onClick={handleClickShowPickColor}
                  >
                    <ColorizeIcon />
                  </IconButton>
                </Box>
                <Box display="flex" flexDirection="column" p={2} gap={3}>
                  <LabelAttributes
                    onChangeAttribute={handleChangeAttribute}
                    attributes={attributes}
                  />
                </Box>
                {renderPickColor()}
                <Box display="flex" justifyContent="flex-end" marginTop={6}>
                  <MyButton variant="contained" color="primary" type="submit">
                    Add
                  </MyButton>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};
interface LabelClassPropertiesOptionType {
  inputValue?: string;
  color: string;
  label: Label;
}
export default ClassLabel;
