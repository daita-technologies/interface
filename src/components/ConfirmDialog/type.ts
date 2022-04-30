import { SxProps, Theme } from "@mui/material";
import React from "react";

export type EmptyFunctionType = () => void;

export interface OpenConfirmDialogParams {
  sx?: SxProps<Theme>;
  content: React.ReactNode;
  onClose?: Function;
  negativeText: string;
  positiveText: string;
  onClickNegative: EmptyFunctionType;
  onClickPositive: EmptyFunctionType;
}

export interface ConfirmDialogContextProps {
  sx?: SxProps<Theme>;
  confirmDialogContent: React.ReactNode;
  negativeText: string;
  positiveText: string;
  onClickNegative: EmptyFunctionType;
  onClickPositive: EmptyFunctionType;
  openConfirmDialog: ({
    sx,
    content,
    onClose,
    negativeText,
    positiveText,
    onClickNegative,
    onClickPositive,
  }: OpenConfirmDialogParams) => void;
  closeConfirmDialog: EmptyFunctionType;
}

export interface ConfirmDialogProps {
  sx?: SxProps<Theme>;
}
