import React from "react";
import { Helmet } from "react-helmet";
import {
  // Header,
  Sidebar,
  Footer,
} from "components";
import { Box, Container } from "@mui/material";
import { DeleteConfirmDialog, FeedbackComponent } from "components";
import { useSelector } from "react-redux";
import { selectorIsLogged } from "reduxes/auth/selector";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = function ({ children }: LayoutProps) {
  const isLogged = useSelector(selectorIsLogged);

  return (
    <Box>
      <Box display="flex">
        <Helmet>
          <title>DAITA Platform</title>
        </Helmet>
        <Sidebar />
        <Box
          width={`calc(100% - ${isLogged ? "17" : "0"}%)`}
          minHeight="calc(100vh - 66px)"
        >
          {/* <Header /> */}
          <Container maxWidth="xl">{children}</Container>
          <DeleteConfirmDialog />
        </Box>
      </Box>
      {isLogged && <FeedbackComponent />}
      <Footer />
    </Box>
  );
};

export default Layout;
