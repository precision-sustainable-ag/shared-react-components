import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material";
import PropTypes from "prop-types";

export function PSALineChart({ title, xAxis, yAxis, data, options = null }) {
  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: "IBM Plex Sans",
      },
    },
  });
  const theme = useTheme();

  const [chartOptions, setChartOptions] = useState({
    title: {
      text: title,
    },
    xAxis: {
      categories: xAxis.categories,
      title: {
        text: xAxis.title,
        style: {
          fontStyle: "italic",
          color: theme.palette.additional.grey2,
        },
      },
      lineWidth: 0,
    },
    yAxis: {
      title: {
        text: yAxis.title,
        style: {
          fontStyle: "italic",
          color: theme.palette.additional.grey2,
        },
      },
    },
    series: data,
    chart: {
      type: "line",
      plotBackgroundColor: theme.palette.additional.background2,
      plotBorderColor: theme.palette.main.background1,
      plotBorderWidth: 2,
    },
  });

  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      title: { text: title || prevOptions.title.text },
      xAxis: {
        title: { text: xAxis.title || prevOptions.xAxis.title.text },
        categories: xAxis.categories || prevOptions.xAxis.categories,
      },
      yAxis: { title: { text: yAxis.title || prevOptions.yAxis.title.text } },
      data: data || prevOptions.data,
    }));
  }, [title, xAxis, yAxis, data]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options === null ? chartOptions : options}
    />
  );
}

/* Define Props Type */

PSALineChart.propTypes = {
  /**
   * The title of the chart.
   */
  title: PropTypes.string,
  /**
   * The xAxis of the chart, `title` is the title of the xAxis, and `categories` is the custom labels for xAxis.
   */
  xAxis: PropTypes.shape({
    title: PropTypes.string,
    categories: PropTypes.array,
  }),
  /**
   * The yAxis of the chart, `title` is the title of the yAxis.
   */
  yAxis: PropTypes.shape({
    title: PropTypes.string,
  }),
  /**
   * The data of the chart, `name` is the name of the data series, and `data` is the array of data.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.array,
    })
  ),
  /**
   * A props for custom setting the options of the chart. Default to `null`.
   */
  options: PropTypes.object,
};
