import { Box } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";

interface LayoutProps {
  children: React.ReactNode;
}

const EmptyLayout = function ({ children }: LayoutProps) {
  return (
    <Box>
      <Box>
        <Helmet>
          <title>DAITA Platform</title>
        </Helmet>
        <Box minHeight="calc(100vh - 66px)">{children}</Box>
      </Box>
    </Box>
  );
};

export default EmptyLayout;
