import { Box } from "@mui/material";
import { Footer } from "components";
import React from "react";
import { Helmet } from "react-helmet";

interface LayoutProps {
  children: React.ReactNode;
}

const GuestLayout = function ({ children }: LayoutProps) {
  return (
    <Box>
      <Box>
        <Helmet>
          <title>DAITA Platform</title>
        </Helmet>
        <Box minHeight="calc(100vh - 66px)">{children}</Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default GuestLayout;
