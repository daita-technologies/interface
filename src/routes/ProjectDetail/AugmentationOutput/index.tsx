import { Box, TextField, Typography } from "@mui/material";
import { MAX_AUGMENT_FREE_PLAN } from "constants/defaultValues";
// import { separateNumber } from "utils/general";
import { AugmentationOutputProps } from "./type";

const AugmentationOutput = function (props: AugmentationOutputProps) {
  return (
    <Box>
      <Typography fontWeight={500}>Augmentation Output</Typography>
      <Typography sx={{ mt: 1 }} variant="body2">
        For each image in your training set, how many augmented versions do you
        want ?
      </Typography>
      <Box
        sx={{ mt: 1 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          sx={{ input: { textAlign: "center" } }}
          inputProps={{ size: 8 }}
          value={1}
          disabled
          size="small"
        />
        <Typography sx={{ ml: 2 }} variant="body2">
          Free Plan Max. {MAX_AUGMENT_FREE_PLAN}
        </Typography>
      </Box>
      {/* <Typography
        sx={{ mt: 1 }}
        variant="body2"
        fontWeight="bold"
        textAlign="center"
      >
        Output Size:{" "}
        <Typography variant="body2" component="span">
          Up to {separateNumber("4500")} images
        </Typography>
      </Typography> */}
    </Box>
  );
};

export default AugmentationOutput;
