import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

interface MyButtonProps extends ButtonProps {
  isLoading?: boolean;
}

// interface ButtonWrapperProps extends StyledComponent {
//   fullWidth?: boolean;
// }

const ButtonWrapper: any = styled("div")(() => ({
  display: "inline-flex",
  position: "relative",
}));

const MyButton = (props: MyButtonProps) => {
  const { children, isLoading, fullWidth, sx, disabled } = props;

  const buttonProps = { ...props };
  delete buttonProps.isLoading;
  delete buttonProps.children;
  delete buttonProps.sx;

  return (
    <ButtonWrapper sx={{ width: fullWidth ? "100%" : "auto", ...sx }}>
      <Button {...buttonProps} disabled={disabled || isLoading}>
        {children}
      </Button>
      {isLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: `calc(50% - 24px / 2)`,
            left: `calc(50% - 24px / 2)`,
          }}
          size={24}
          color="inherit"
        />
      )}
    </ButtonWrapper>
  );
};

export default MyButton;
