import React, { createContext, memo, useMemo, useState } from "react";
import useConfirmDialog from "hooks/useConfirmDialog";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  Theme,
} from "@mui/material";

import {
  ConfirmDialogContextProps,
  ConfirmDialogProps,
  EmptyFunctionType,
  OpenConfirmDialogParams,
} from "./type";

export const ConfirmDialog = memo(({ sx }: ConfirmDialogProps) => {
  const {
    confirmDialogContent,
    closeConfirmDialog,
    negativeText,
    positiveText,
    onClickNegative,
    onClickPositive,
  } = useConfirmDialog();

  const isDisplay = !!confirmDialogContent;

  return (
    <Dialog
      sx={sx}
      open={isDisplay}
      // onClose={closeConfirmDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>{confirmDialogContent}</DialogContent>
      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button
          sx={{ mr: 2 }}
          onClick={() => {
            if (onClickNegative) {
              onClickNegative();
            }
            closeConfirmDialog();
          }}
          variant="outlined"
          color="inherit"
        >
          {negativeText}
        </Button>
        <Button onClick={onClickPositive} variant="contained" color="primary">
          {positiveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export const ConfirmDialogContext = createContext<ConfirmDialogContextProps>({
  sx: undefined,
  confirmDialogContent: null,
  openConfirmDialog: () => {},
  closeConfirmDialog: () => {},
  negativeText: "Yes",
  positiveText: "No",
  onClickNegative: () => {},
  onClickPositive: () => {},
});

export const ConfirmDialogProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localSx, setLocalSx] = useState<SxProps<Theme>>();

  const [localNegativeText, setLocalNegativeText] = useState("Yes");
  const [localPositiveText, setLocalPositiveText] = useState("No");

  const [localOnClickNegative, setLocalOnClickNegative] =
    useState<EmptyFunctionType>(() => {});

  const [localOnClickPositive, setLocalOnClickPositive] =
    useState<EmptyFunctionType>(() => {});

  const [confirmDialogContent, setConfirmDialogContent] =
    useState<React.ReactNode>(null);

  const [onConfirmDialogClose, setOnConfirmDialogClose] = useState<
    Function | undefined
  >();

  const openConfirmDialog = ({
    content,
    onClose,
    sx,
    negativeText,
    positiveText,
    onClickNegative,
    onClickPositive,
  }: OpenConfirmDialogParams) => {
    if (!confirmDialogContent) {
      setLocalSx(sx);

      setLocalNegativeText(negativeText);
      setLocalPositiveText(positiveText);

      setLocalOnClickNegative(() => onClickNegative);
      setLocalOnClickPositive(() => onClickPositive);

      setConfirmDialogContent(content);

      setOnConfirmDialogClose(() => onClose);
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialogContent(null);
    if (onConfirmDialogClose) {
      onConfirmDialogClose();
    }
  };

  const confirmDialogContextValue = useMemo(
    () => ({
      sx: localSx,
      confirmDialogContent,
      openConfirmDialog,
      closeConfirmDialog,
      negativeText: localNegativeText,
      positiveText: localPositiveText,
      onClickNegative: localOnClickNegative,
      onClickPositive: localOnClickPositive,
    }),
    [
      localSx,
      confirmDialogContent,
      openConfirmDialog,
      closeConfirmDialog,
      localNegativeText,
      localPositiveText,
      localOnClickNegative,
      localOnClickPositive,
    ]
  );

  return (
    <ConfirmDialogContext.Provider value={confirmDialogContextValue}>
      <ConfirmDialog sx={localSx} />
      {children}
    </ConfirmDialogContext.Provider>
  );
};
