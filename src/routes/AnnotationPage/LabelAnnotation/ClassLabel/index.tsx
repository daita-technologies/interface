import CancelIcon from "@mui/icons-material/Cancel";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { Box, IconButton, Modal, Popover, Typography } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { MyButton } from "components";
import { Label, LabelClassProperties } from "components/Annotation/Editor/type";
import * as React from "react";
import { useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateLabelOfDrawObject } from "reduxes/annotation/action";
import { addNewClassLabel } from "reduxes/annotationmanager/action";
import { selectorLabelClassPropertiesByLabelClass } from "reduxes/annotationmanager/selecetor";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { ClassLabelProps } from "./type";

const filter = createFilterOptions<LabelClassPropertiesOptionType>();

export const convertStrokeColorToFillColor = (color: string) => {
  if (color && color.length > 1) {
    return color + "33";
  }
  return "";
};
const opptionType2LabelClassProperties = (
  value: LabelClassPropertiesOptionType
): LabelClassProperties => {
  return {
    label: { label: value.label.label },
    cssStyle: {
      fill: convertStrokeColorToFillColor(value.color),
      stroke: value.color,
    },
  };
};
const ClassLabel = function ({ drawObject }: ClassLabelProps) {
  const dispatch = useDispatch();
  // const [value, setValue] = useState<LabelClassPropertiesOptionType | null>();
  const [open, toggleOpen] = useState(false);
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setDialogValue({
      label: { label: "" },
      color: "",
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] =
    useState<LabelClassPropertiesOptionType>({
      color: "#1abbcc",
      label: { label: "" },
    });

  const onSubmitLabelPropeties: SubmitHandler<
    LabelClassPropertiesOptionType
  > = (data) => {
    dispatch(
      addNewClassLabel({
        labelClassProperties: opptionType2LabelClassProperties(dialogValue),
      })
    );
    handleChangeClassLabel(dialogValue);
    handleClose();
  };
  const handleChangeColor = (newColor: string) => {
    setDialogValue({ ...dialogValue, color: newColor });
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
          color={dialogValue.color}
          onChange={handleChangeColor}
        />
      </Popover>
    );
  };
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<LabelClassPropertiesOptionType>({ mode: "onChange" });
  const handleChangeClassLabel = (
    newValue: LabelClassPropertiesOptionType | null
  ) => {
    if (newValue) {
      let properties = labelClassPropertiesByLabelClass[newValue.label.label];
      if (!properties) {
        properties = opptionType2LabelClassProperties(dialogValue);
      }
      dispatch(
        updateLabelOfDrawObject({
          drawObjectId: drawObject.data.id,
          labelClassProperties: properties,
        })
      );
    }
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
  return (
    <React.Fragment>
      <Autocomplete
        value={labelClassProperties}
        // defaultValue={{
        //   ...labelClassPropertiesByLabelClass[drawObject.data.label.label],
        //   inputValue: "",
        // }}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                label: { label: newValue },
                color: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              label: { label: newValue.inputValue },
              color: "",
            });
          } else {
            handleChangeClassLabel(newValue);
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
        sx={{ width: 200 }}
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
              <Box display="flex" alignItems="flex-end" width="100%">
                <TextField
                  fullWidth
                  autoFocus
                  margin="dense"
                  id="name"
                  value={dialogValue.label.label}
                  onChange={(event) =>
                    setDialogValue({
                      ...dialogValue,
                      label: { label: event.target.value },
                    })
                  }
                  label="Add class name"
                  type="text"
                  variant="standard"
                />
                <IconButton
                  sx={{ backgroundColor: dialogValue.color }}
                  onClick={handleClickShowPickColor}
                >
                  <ColorizeIcon />
                </IconButton>
              </Box>
              {renderPickColor()}
              <Box display="flex" justifyContent="flex-end" marginTop={6}>
                <MyButton variant="contained" color="primary" type="submit">
                  Add
                </MyButton>
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
