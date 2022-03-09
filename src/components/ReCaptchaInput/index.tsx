import { Controller } from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "constants/defaultValues";
import { ReCaptchaInputProps } from "./type";

const ReCaptchaInput = function ({
  recaptchaRef,
  control,
  register,
}: ReCaptchaInputProps) {
  return (
    <Controller
      control={control}
      {...register("captcha", {
        required: { value: true, message: "You need to verify the captcha." },
      })}
      name="captcha"
      render={({ field, fieldState: { error } }) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          my={2}
        >
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token: any) => field.onChange(token)}
          />

          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default ReCaptchaInput;
