import ColorizeIcon from "@mui/icons-material/Colorize";
import { Box, Button, Popover } from "@mui/material";
import TextField from "@mui/material/TextField";
import { MyButton } from "components";
import { LINE_STYLE } from "components/Annotation/Editor/const";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addNewClassLabel,
  editClassLabel,
  setDialogClassManageModal,
} from "reduxes/annotationmanager/action";
import {
  selectorDialogClassManageModal,
  selectorLabelClassPropertiesByLabelClass,
} from "reduxes/annotationmanager/selecetor";
import { LabelForm } from "../ClassLabel/type";
import FieldArrayAttribute from "./FieldArrayAttribute";
import { ClassManageDialogProps } from "./type";

export const convertStrokeColorToFillColor = (color: string) => {
  if (color && color.length > 1) {
    return color + "33";
  }
  return "";
};

const useClassManageEditor = function (): ClassManageDialogProps {
  const dispatch = useDispatch();
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const dialogClassManageModal = useSelector(selectorDialogClassManageModal);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LabelForm>({
    mode: "onChange",
  });
  useEffect(() => {
    if (!!dialogClassManageModal.isOpen && dialogClassManageModal.className) {
      if (labelClassPropertiesByLabelClass[dialogClassManageModal.className]) {
        const { label, cssStyle } =
          labelClassPropertiesByLabelClass[dialogClassManageModal.className];
        setValue("label", label.label);
        setValue("color", cssStyle?.stroke ? cssStyle.stroke : "FFFBBB");
        setValue("attributes", label.attributes ? label.attributes : []);
      }
    } else {
      setValue("label", "");
      setValue("color", "FFFBBB");
      setValue("attributes", []);
    }
  }, [dialogClassManageModal]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openPickColor = Boolean(anchorEl);
  const handleClosePickColor = () => {
    setAnchorEl(null);
  };
  const handleChangeColor = (newColor: string) => {
    setValue("color", newColor);
  };

  const renderPickColor = () => {
    return (
      <Popover
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
  console.log("openPickColor", openPickColor, anchorEl);
  const handleClickShowPickColor = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log("handleClickShowPickColor", event.currentTarget);
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
    event.preventDefault();
  };
  const onSubmit = (data: LabelForm) => {
    if (dialogClassManageModal.classManageModalType === "CREATE") {
      dispatch(
        addNewClassLabel({
          labelClassProperties: {
            label: { label: data.label, attributes: data.attributes },
            cssStyle: {
              ...LINE_STYLE,
              stroke: data.color,
              fill: convertStrokeColorToFillColor(data.color),
            },
          },
        })
      );
      toast.success("Add new class success");
    } else if (dialogClassManageModal.classManageModalType === "EDIT") {
      if (dialogClassManageModal.className) {
        dispatch(
          editClassLabel({
            label: dialogClassManageModal.className,
            labelClassProperties: {
              label: { label: data.label, attributes: data.attributes },
              cssStyle: {
                ...LINE_STYLE,
                stroke: data.color,
                fill: convertStrokeColorToFillColor(data.color),
              },
            },
          })
        );
        toast.success("Edit class success");
      }
    }
    if (
      dialogClassManageModal.classManageModalType === "CREATE" &&
      dialogClassManageModal.className?.length !== 0
    ) {
      dispatch(
        setDialogClassManageModal({
          isOpen: false,
        })
      );
    } else {
      dispatch(
        setDialogClassManageModal({
          isOpen: true,
          classManageModalType: "VIEW",
        })
      );
    }
  };
  const backToClassViewList = () => {
    dispatch(
      setDialogClassManageModal({
        isOpen: true,
        classManageModalType: "VIEW",
      })
    );
  };
  return {
    title:
      dialogClassManageModal.classManageModalType == "EDIT"
        ? "Edit class"
        : "Add new class",
    content: (
      <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="flex-end" width="100%">
            <Button
              sx={{
                backgroundColor: getValues("color"),
                height: 50,
                marginRight: 2,
              }}
              onClick={handleClickShowPickColor}
              endIcon={<ColorizeIcon />}
            />
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
                minLength: {
                  value: 1,
                  message: `Please enter a valid class name.`,
                },
              })}
              error={!!errors.label}
              helperText={(errors.label && errors.label.message) || ""}
              value={dialogClassManageModal.className}
              label="Class name"
              type="text"
              variant="standard"
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <FieldArrayAttribute control={control} register={register} />
          </Box>
          {renderPickColor()}
        </Box>
      </form>
    ),
    action: (
      <Box display="flex" flexDirection="column" width="100%">
        <Box display="flex" justifyContent="end" gap={3}>
          <MyButton
            variant="contained"
            color="warning"
            onClick={backToClassViewList}
          >
            Back
          </MyButton>
          <MyButton
            variant="contained"
            color="primary"
            type="submit"
            form="hook-form"
          >
            Save
          </MyButton>
        </Box>
      </Box>
    ),
  };
};
export default useClassManageEditor;
