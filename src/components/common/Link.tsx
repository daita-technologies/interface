import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";


function Link({ children, variant = 'default', ...restProps }: any) {
  return (
    <MuiLink className={variant === 'text' ? 'text-link' : ''} component={RouterLink} {...restProps}>
      {children}
    </MuiLink>
  );
}

export default Link;
