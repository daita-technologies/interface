import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "constants/defaultValues";
import { ReCaptchaInputProps } from "./type";

const REQUIRE_RECAPTCHA_ERROR_MESSAGE = "You need to verify the captcha.";

const ReCaptchaInput = function ({
  recaptchaRef,
  control,
  register,
}: ReCaptchaInputProps) {
  useEffect(() => {
    register("captcha", {
      required: {
        value: true,
        message: REQUIRE_RECAPTCHA_ERROR_MESSAGE,
      },
    });
  }, []);

  return (
    <Controller
      control={control}
      name="captcha"
      render={({ fieldState: { error } }) => (
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
            size="invisible"
            badge="inline"
          />
          {/* NOTE: We use invisible recaptcha is auto generate when submitted, therefore no need show required message */}
          {error && error.message !== REQUIRE_RECAPTCHA_ERROR_MESSAGE && (
            <FormHelperText error>{error.message}</FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default ReCaptchaInput;
