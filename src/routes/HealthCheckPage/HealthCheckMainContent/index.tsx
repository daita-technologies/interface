import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectHealthCheckInfoAction } from "reduxes/healthCheck/action";
import { ORIGINAL_SOURCE } from "constants/defaultValues";
import { Empty } from "components";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

import {
  selectorActiveDataHealthCheck,
  selectorIsHealthCheckLoading,
} from "reduxes/healthCheck/selector";

import HealthCheckChart from "../HealthCheckChart";
import { HealthCheckMainContentProps } from "./type";

const HealthCheckMainContent = function ({
  projectId,
}: HealthCheckMainContentProps) {
  const activeDataHealthCheck = useSelector(selectorActiveDataHealthCheck);

  const isHealthCheckLoading = useSelector(selectorIsHealthCheckLoading);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getProjectHealthCheckInfoAction({ projectId, dataType: ORIGINAL_SOURCE })
    );
  }, [projectId]);

  const renderContent = () => {
    if (isHealthCheckLoading || !activeDataHealthCheck) {
      return (
        <Box py={6} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (activeDataHealthCheck && activeDataHealthCheck?.length > 0) {
      return <HealthCheckChart projectId={projectId} />;
    }

    return (
      <Empty
        description={
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            rowGap={2}
          >
            <Typography>
              No information about your data health check yet.
            </Typography>
            <Button variant="contained" color="primary">
              Run Data Health Check
            </Button>
          </Box>
        }
      />
    );
  };

  return <Box py={2}>{renderContent()}</Box>;
};

export default HealthCheckMainContent;
