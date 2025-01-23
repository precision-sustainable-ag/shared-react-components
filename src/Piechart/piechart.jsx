import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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
      <HighchartsReact highcharts={Highcharts} options={options} />
  );
};

PSAPiechart.propTypes = {
   /** Array of objects with `name` (string) and `value` (number) for pie chart data */
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
   /** Title of the chart */
  label: PropTypes.string,
  /** Indicates if the chart should render as a donut (true) or standard pie chart (false) */
  donut: PropTypes.bool,
};

export default PSAPiechart;
