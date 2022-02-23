import { Box, Container, Typography } from "@mui/material";

import LanguageIcon from "@mui/icons-material/Language";

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
