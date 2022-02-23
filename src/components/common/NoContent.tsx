import { Box, Typography } from "@mui/material";
interface NoContentProps {
  message: string;
}

const NoContent = (props: NoContentProps) => {
  const { message } = props;

  return (
    <Box sx={{ my: 4 }} fontStyle="italic" textAlign="center">
      <Typography color="textSecondary" variant="subtitle1">
        {message || "Không có thông tin."}
      </Typography>
    </Box>
  );
};

export default NoContent;
