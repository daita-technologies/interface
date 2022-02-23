import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

const Link = (props: any) => {
  const { children, ...restProps } = props;
  return (
    <MuiLink component={RouterLink} {...restProps}>
      {children}
    </MuiLink>
  );
};

export default Link;
