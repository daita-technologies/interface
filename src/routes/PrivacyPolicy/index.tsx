import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import MarkdownPage from "routes/MarkdownPage";

const PrivacyPolicy = function () {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/assets/doc/privacy.md')
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      <Box
        sx={{
          bgcolor: "#808785",
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgb(96 96 144) 35%, rgb(62 74 93) 100%)",
        }}
        height="9vh"
        lineHeight="9vh"
        textAlign="center"
        fontSize={30}
      >
        Privacy Policy
      </Box>
      <MarkdownPage content={content} isLoading={isLoading} />
    </>
  );
};

export default PrivacyPolicy;
