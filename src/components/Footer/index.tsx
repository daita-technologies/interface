import LanguageIcon from "@mui/icons-material/Language";
import { Box, Container, Typography } from "@mui/material";
import Link from "components/common/Link";

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
            <Link to="/we-take-your-privacy-seriously" variant='text'>
              Privacy Policy
            </Link>
          </Box>
          <Box>
            <Link to="/terms" variant='text'>Terms of Service</Link>
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
