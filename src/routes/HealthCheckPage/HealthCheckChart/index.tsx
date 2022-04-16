import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { darkTheme } from "styles/theme";
import { Box, Typography } from "@mui/material";

import { HealthCheckChartProps } from "./type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// const randomColors = () => {
//   const red = Math.floor(Math.random() * 256);
//   const green = Math.floor(Math.random() * 256);
//   const blue = Math.floor(Math.random() * 256);

//   return `rgb(${red},${green},${blue})`;
// };

const HealthCheckChart = function ({ projectId }: HealthCheckChartProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography>{projectId}</Typography>
      <Line
        data={{
          labels: ["file name 1", "file name 2"],
          datasets: [
            {
              label: "Brightness",
              data: [30, 40, 45, 50, 49, 60, 70, 91],
              backgroundColor: darkTheme.palette.primary.main,
              borderWidth: 1,
              borderColor: darkTheme.palette.primary.main,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "brightness",
              position: "bottom",
              align: "center",
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </Box>
  );
};

export default HealthCheckChart;
