import ArticleIcon from "@mui/icons-material/Article";
import { Box, BoxProps, Typography } from "@mui/material";
import { EmptyProps } from "./type";

const Empty = function ({
  description = (
    <Typography mt={2} color="text.secondary">
      No data
    </Typography>
  ),
  ...otherProps
}: BoxProps & EmptyProps) {
  return (
    <Box
      {...otherProps}
      py={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <ArticleIcon sx={{ color: "text.secondary", mb: 2 }} fontSize="large" />
      {description}
    </Box>
  );
};

export default Empty;
