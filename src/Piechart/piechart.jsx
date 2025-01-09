import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";

export const PSAPiechart = ({ chartData, label, donut = false }) => {
  const options = {
    chart: {
      type: "pie",
      height: 400,
    },
    title: {
      text: label,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage}%</b>",
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
          format: "{point.percentage:.2f}%",
          connectorWidth: 0,
          distance: 2,
          style: {
            fontSize: "14px",
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
        data: chartData.map((data) => ({
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
        width:  "100%",
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
  donut: PropTypes.bool,
};

export default PSAPiechart;
