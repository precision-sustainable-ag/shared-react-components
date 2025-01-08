import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";
import { Square } from "@mui/icons-material";

const COLORS = ["#c48b0f", "#27739e", "#598445", "#91643b"];

// Graph size mappings
const sizeMapping = {
  small: "33%",
  medium: "50%",
  large: "100%",
};

// Legend Component for Highcharts
const PSAPieChartLegend = ({ chartData }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: "1rem",
    }}
  >
    {chartData.map((data, i) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
        key={i}
      >
        <Square sx={{ color: COLORS[i % COLORS.length], marginRight: "0.5rem" }} />
        <Typography>{data.name}</Typography>
      </Box>
    ))}
  </Box>
);

// Main Pie Chart Component using Highcharts
export const PSAPiechart = ({ chartData, label, size = "medium" }) => {
  const options = {
    chart: {
      type: "pie",
      height: 400,
    },
    title: {
      text: label || "Pie Chart",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.1f}%",
          connectorWidth: 0,
          style: {
            fontSize: "14px",
            fontWeight: "normal",
          },
        },
        showInLegend: false,
      },
    },
    series: [
      {
        name: "Share",
        colorByPoint: true,
        data: chartData.map((data, i) => ({
          name: data.name,
          y: data.value,
          color: COLORS[i % COLORS.length],
        })),
      },
    ],
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        width: sizeMapping[size],
      }}
    >

      <Box sx={{ flex: 1, minWidth: "300px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <PSAPieChartLegend chartData={chartData} />
      </Box>
    </Box>
  );
};

PSAPiechart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  label: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default PSAPiechart;
