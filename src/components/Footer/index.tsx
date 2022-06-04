import LanguageIcon from "@mui/icons-material/Language";
import { Box, Container, Link, Typography } from "@mui/material";

const Footer = function () {
  return (
    <Box sx={{ backgroundColor: "primary.dark" }}>
      <Container maxWidth="xl">
        <Box
          py={2}
          px={2}
          height={66}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography>
              © 2022 DAITA Technologies. All Rights Reserved.
            </Typography>
          </Box>
          <Box>
            <Link
              href="/we-take-your-privacy-seriously"
              underline="none"
              target="_blank"
              rel="noopener"
              color="inherit"
            >
              Privacy Policy
            </Link>
          </Box>
          <Box>
            <Link
              href="/terms"
              underline="none"
              target="_blank"
              rel="noopener"
              color="inherit"
            >
              Terms of Service
            </Link>
          </Box>
          <Box display="flex" alignItems="center">
            <LanguageIcon sx={{ mr: 1 }} />
            <Typography>
              Based in Switzerland, proudly made for the world.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
