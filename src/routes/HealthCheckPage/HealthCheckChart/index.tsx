import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

import { Autocomplete, Box, TextField } from "@mui/material";
import {
  EXTENSION_HEALTH_CHECK_FIELD,
  HEALTH_CHECK_ATTRIBUTES_ARRAY,
} from "constants/healthCheck";
import { darkTheme } from "styles/theme";

import { useMemo, useState } from "react";
import { HealthCheckFields } from "services/healthCheckApi";
import { getChartTypeFromAttributeName } from "utils/healthCheck";

import { MyButton } from "components";
import { useDispatch, useSelector } from "react-redux";
import { selectorIsRunningHealthCheck } from "reduxes/healthCheck/selector";
import { runHealthCheckAction } from "reduxes/healthCheck/action";
import { ORIGINAL_SOURCE } from "constants/defaultValues";

import { HealthCheckChartProps } from "./type";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const randomColors = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return `rgb(${red},${green},${blue})`;
};

const getChartData = (
  data: HealthCheckFields[],
  selectedAttribue: keyof HealthCheckFields
) => {
  const fileNameArray: string[] = [];
  const dataArray: any[] = [];

  if (selectedAttribue !== EXTENSION_HEALTH_CHECK_FIELD.value) {
    data.forEach((eachFileData) => {
      fileNameArray.push(eachFileData.file_name);
      dataArray.push(eachFileData[selectedAttribue]);
    });
  } else {
    const fileExtensionArray: string[] = [];
    const repeatCount: number[] = [];

    data.forEach((eachFileData) => {
      const { extension } = eachFileData;
      if (fileExtensionArray.indexOf(extension) < 0) {
        fileExtensionArray.push(extension);
        repeatCount.push(1);
      } else {
        const matchIndex = fileExtensionArray.indexOf(extension);
        repeatCount[matchIndex] += 1;
      }
    });

    return {
      fileNameArray: fileExtensionArray,
      dataArray: repeatCount,
    };
  }

  return {
    fileNameArray,
    dataArray,
  };
};

const HealthCheckChart = function ({ data, projectId }: HealthCheckChartProps) {
  const dispatch = useDispatch();
  const [selectedAttribue, setSelectedAttribue] = useState<{
    label: string;
    value: keyof HealthCheckFields;
  }>(HEALTH_CHECK_ATTRIBUTES_ARRAY[0]);

  const isRunningHealthCheck = useSelector(selectorIsRunningHealthCheck);

  const { fileNameArray, dataArray } = getChartData(
    data,
    selectedAttribue.value
  );

  const chartType = useMemo(
    () => getChartTypeFromAttributeName(selectedAttribue.value),
    [selectedAttribue]
  );

  const onClickRunHealthCheck = () => {
    dispatch(runHealthCheckAction({ projectId, dataType: ORIGINAL_SOURCE }));
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <Line
            data={{
              labels: fileNameArray,
              datasets: [
                {
                  data: dataArray,
                  backgroundColor: darkTheme.palette.primary.main,
                  borderWidth: 2,
                  borderColor: darkTheme.palette.primary.main,
                  pointBackgroundColor: darkTheme.palette.text.primary,
                  pointBorderColor: darkTheme.palette.text.primary,
                  pointBorderWidth: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: "category",
                  display: false,
                  grid: {
                    color: darkTheme.palette.text.primary,
                  },
                },
                y: {
                  type: "linear",
                  grid: {
                    color: `${darkTheme.palette.text.primary}66`,
                    drawBorder: false,
                  },
                  ticks: {
                    color: `${darkTheme.palette.text.primary}`,
                  },
                },
              },
              plugins: {
                zoom: {
                  pan: {
                    enabled: true,
                    mode: "xy",
                    threshold: 5,
                  },
                  zoom: {
                    wheel: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true,
                    },
                    mode: "x",
                  },
                },
                title: {
                  display: true,
                  text: selectedAttribue.label,
                  position: "bottom",
                  align: "center",
                  font: {
                    size: 24,
                  },
                  color: darkTheme.palette.text.primary,
                  padding: {
                    top: 24,
                  },
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        );

      default:
        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box width="50%">
              <Pie
                data={{
                  labels: fileNameArray,
                  datasets: [
                    {
                      data: dataArray,
                      backgroundColor: new Array(dataArray.length)
                        .fill(1)
                        .map(() => randomColors()),
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: selectedAttribue.label,
                      position: "bottom",
                      align: "center",
                      font: {
                        size: 24,
                      },
                      color: darkTheme.palette.text.primary,
                      padding: {
                        top: 24,
                      },
                    },
                    // legend: {
                    //   display: false,
                    // },
                  },
                }}
              />
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={6}
      >
        <MyButton
          variant="contained"
          color="primary"
          isLoading={isRunningHealthCheck}
          onClick={onClickRunHealthCheck}
        >
          Rerun Data Health Check
        </MyButton>

        <Autocomplete
          sx={{ flexBasis: "40%" }}
          disablePortal
          options={HEALTH_CHECK_ATTRIBUTES_ARRAY}
          isOptionEqualToValue={(option, selected) =>
            option.value === selected.value
          }
          value={selectedAttribue}
          onChange={(_, item) => {
            if (item) {
              setSelectedAttribue(item);
            }
          }}
          renderInput={(params) => <TextField label="Attribute" {...params} />}
        />
      </Box>

      <Box>{renderChart()}</Box>
    </Box>
  );
};

export default HealthCheckChart;
