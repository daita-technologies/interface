import { Box, Container } from "@mui/material";
import {
  DeleteConfirmDialog,
  FeedbackComponent,
  Footer,
  Sidebar,
} from "components";
import DeleteAnnotationProjectConfirmDialog from "components/DeleteAnnotationProjectConfirmDialog";
import React from "react";
import { Helmet } from "react-helmet";
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
          <DeleteAnnotationProjectConfirmDialog />
        </Box>
      </Box>
      {isLogged && <FeedbackComponent />}
      <Footer />
    </Box>
  );
};

export default Layout;
