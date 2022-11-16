import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Label } from "components/Annotation/Editor/type";
import * as React from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLabelOfDrawObject } from "reduxes/annotation/action";
import { setDialogClassManageModal } from "reduxes/annotationmanager/action";
import { selectorLabelClassPropertiesByLabelClass } from "reduxes/annotationmanager/selecetor";
import { ClassLabelProps } from "./type";

const filter = createFilterOptions<LabelClassPropertiesOptionType>();

export const convertStrokeColorToFillColor = (color: string) => {
  if (color && color.length > 1) {
    return `${color}33`;
  }
  return "";
};

function ClassLabel({ drawObject }: ClassLabelProps) {
  const dispatch = useDispatch();
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );

  const listLabelClassProperties: LabelClassPropertiesOptionType[] =
    React.useMemo(
      () =>
        Object.entries(labelClassPropertiesByLabelClass).map(([, value]) => ({
          inputValue: "",
          color: value.cssStyle.stroke,
          label: value.label,
        })) as LabelClassPropertiesOptionType[],
      [labelClassPropertiesByLabelClass]
    );

  const handleChangeClassLabel = (label: string) => {
    const properties = labelClassPropertiesByLabelClass[label];
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

  return (
    <Autocomplete
      value={labelClassProperties}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setTimeout(() => {
            dispatch(
              setDialogClassManageModal({
                isOpen: true,
                className: newValue,
                classManageModalType: "CREATE",
              })
            );
          });
        } else if (newValue && newValue.inputValue) {
          dispatch(
            setDialogClassManageModal({
              isOpen: true,
              className: newValue.inputValue,
              classManageModalType: "CREATE",
            })
          );
        } else if (newValue) {
          handleChangeClassLabel(newValue.label.label);
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
      renderOption={(props, option) => <li {...props}>{option.label.label}</li>}
      sx={{ maxWidth: 180 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} size="small" variant="standard" />
      )}
    />
  );
}
interface LabelClassPropertiesOptionType {
  inputValue?: string;
  color: string;
  label: Label;
}
export default ClassLabel;
