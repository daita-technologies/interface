import {
  AppBar,
  Avatar,
  Box,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "components";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import MarkdownPage from "routes/MarkdownPage";

const PrivacyPolicy = function () {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/assets/doc/privacy.md")
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
    <Box>
      <Helmet>
        <title>Privacy Policy | DAITA Platform</title>
      </Helmet>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#808785",
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgb(96 96 144) 35%, rgb(62 74 93) 100%)",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar>
              <Link to="/">
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      my: 1,
                      mb: 1,
                      mx: "auto",
                      width: 56,
                      height: 56,
                      backgroundColor: "#232528",
                    }}
                    src="/assets/images/logo.png"
                    variant="square"
                  />
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    component="div"
                    color="text.primary"
                    pl={1}
                  >
                    DAITA Platform
                  </Typography>
                </Box>
              </Link>
              <Box
                height="9vh"
                lineHeight="9vh"
                textAlign="center"
                fontSize={30}
                sx={{ flexGrow: 1 }}
              >
                Privacy Policy
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <MarkdownPage content={content} isLoading={isLoading} />
    </Box>
  );
};

export default PrivacyPolicy;
