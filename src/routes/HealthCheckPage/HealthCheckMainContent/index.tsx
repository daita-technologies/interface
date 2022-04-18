import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectHealthCheckInfoAction,
  runHealthCheckAction,
} from "reduxes/healthCheck/action";
import { ORIGINAL_SOURCE } from "constants/defaultValues";
import { Empty, MyButton } from "components";

import { Box, CircularProgress, Typography } from "@mui/material";

import {
  selectorActiveDataHealthCheck,
  selectorIsHealthCheckLoading,
  selectorIsRunningHealthCheck,
} from "reduxes/healthCheck/selector";

import HealthCheckChart from "../HealthCheckChart";
import { HealthCheckMainContentProps } from "./type";

const HealthCheckMainContent = function ({
  projectId,
}: HealthCheckMainContentProps) {
  const activeDataHealthCheck = useSelector(selectorActiveDataHealthCheck);

  const isHealthCheckLoading = useSelector(selectorIsHealthCheckLoading);

  const isRunningHealthCheck = useSelector(selectorIsRunningHealthCheck);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getProjectHealthCheckInfoAction({ projectId, dataType: ORIGINAL_SOURCE })
    );
  }, [projectId]);

  const onClickRunHealthCheck = () => {
    dispatch(runHealthCheckAction({ projectId, dataType: ORIGINAL_SOURCE }));
  };

  const renderContent = () => {
    if (isHealthCheckLoading || !activeDataHealthCheck) {
      return (
        <Box py={6} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (activeDataHealthCheck && activeDataHealthCheck?.length > 0) {
      return (
        <Box>
          <HealthCheckChart
            projectId={projectId}
            data={activeDataHealthCheck}
          />
        </Box>
      );
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
            <MyButton
              variant="contained"
              color="primary"
              isLoading={isRunningHealthCheck}
              onClick={onClickRunHealthCheck}
            >
              Run Data Health Check
            </MyButton>
          </Box>
        }
      />
    );
  };

  return <Box py={2}>{renderContent()}</Box>;
};

export default HealthCheckMainContent;
