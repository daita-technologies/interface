import { useMemo } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";

import { Box } from "@mui/material";
import { EXTENSION_HEALTH_CHECK_FIELD } from "constants/healthCheck";
import { darkTheme } from "styles/theme";

import lodash from "lodash";

import { getChartTypeFromAttributeName } from "utils/healthCheck";
import { HealthCheckFields } from "services/healthCheckApi";
import { primaryPallateColors } from "styles/color";

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
  zoomPlugin,
  ChartDataLabels
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

const HealthCheckChart = function ({
  data,
  selectedAttribue,
}: HealthCheckChartProps) {
  const chartType = useMemo(
    () => getChartTypeFromAttributeName(selectedAttribue.value),
    [selectedAttribue]
  );

  const { fileNameArray, dataArray } = useMemo(
    () => getChartData(data, selectedAttribue.value),
    [data, selectedAttribue]
  );

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
                datalabels: {
                  display: false,
                },
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
                        .map(
                          (_, index: number) =>
                            primaryPallateColors[index] || randomColors()
                        ),
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    datalabels: {
                      formatter: (value, ctx) => {
                        const { datasets } = ctx.chart.data;

                        if (
                          datasets.indexOf(ctx.dataset) ===
                          datasets.length - 1
                        ) {
                          const sum = lodash.sum(datasets[0].data) || 0;
                          if (sum !== 0) {
                            return `${((value / sum) * 100).toFixed(2)}%`;
                          }
                          return "0%";
                        }
                        return "0%";
                      },
                      color: darkTheme.palette.common.white,
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
                      labels: {
                        color: darkTheme.palette.text.primary,
                      },
                    },
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
      <Box>{renderChart()}</Box>
    </Box>
  );
};

export default HealthCheckChart;
