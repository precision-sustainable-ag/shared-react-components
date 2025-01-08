import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";

// Graph size mappings
const sizeMapping = {
  small: "33%",
  medium: "50%",
  large: "100%",
};

export const PSAPiechart = ({ chartData, label, size = "medium", donut = false }) => {
  const options = {
    chart: {
      type: "pie",
      height: size === "small" ? 300 : 400,
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
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: donut ? "80%" : "0%",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.1f}%",
          connectorWidth: 0,
          distance: size === "small" ? 2 : 11,
          style: {
            fontSize: size === "small" ? "10px" : "14px",
            fontWeight: "normal",
          },
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Share",
        colorByPoint: true,
        data: chartData.map((data, i) => ({
          name: data.name,
          y: data.value,
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
      <HighchartsReact highcharts={Highcharts} options={options} />
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
  donut: PropTypes.bool,
};

export default PSAPiechart;
