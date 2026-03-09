import { useTheme } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React from 'react';
import Highcharts from '../../utils/highchartsConfig';
import PSASubContainer from '../SubContainer';

export function PSABarChart({
  categories,
  data,
  orientation = 'vertical',
  chartTitle,
  color = '#4caf50',
  xAxisTitle,
  yAxisTitle,
  loading = false,
  height = 400,
  additionalOptions = {},
}) {
  const theme = useTheme();

  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: 'IBM Plex Sans',
      },
    },
  });

  const chartType = orientation === 'horizontal' ? 'bar' : 'column';

  const chartOptions = {
    chart: {
      type: chartType,
      height,
      marginRight: orientation === 'horizontal' ? 100 : null,
      plotBackgroundColor: theme.palette.additional.background2,
      plotBorderColor: theme.palette.main.background1,
      plotBorderWidth: 2,
      ...additionalOptions.chart,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories,
      title: {
        text: xAxisTitle,
        style: {
          fontStyle: 'italic',
          color: theme.palette.additional.grey2,
        },
      },
      labels: {
        style: {
          fontSize: '13px',
          color: 'black',
        },
        ...additionalOptions.xAxis?.labels,
      },
      lineWidth: 0,
      ...additionalOptions.xAxis,
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        style: {
          fontStyle: 'italic',
          color: theme.palette.additional.grey2,
        },
      },
      labels: {
        enabled: true,
        ...additionalOptions.yAxis?.labels,
      },
      ...additionalOptions.yAxis,
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      ...additionalOptions.legend,
    },
    plotOptions: {
      series: {
        stacking: additionalOptions.plotOptions?.series?.stacking || null,
        dataLabels: {
          enabled: true,
          format: '{y}',
          crop: false,
          overflow: 'justify',
          style: {
            textOutline: 'none',
            fontSize: '0.9rem',
            ...additionalOptions.plotOptions?.series?.dataLabels?.style,
          },
          ...additionalOptions.plotOptions?.series?.dataLabels,
        },
        animation: false,
        ...additionalOptions.plotOptions?.series,
      },
      ...additionalOptions.plotOptions,
    },
    series: [
      {
        name: 'Value',
        data,
        color,
        ...additionalOptions.series?.[0],
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
          },
          chartOptions: {
            chart: {
              marginRight: 50,
            },
          },
        },
      ],
    },
    ...additionalOptions,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.length) {
    return <div>No data available</div>;
  }

  return (
    <PSASubContainer
      title={chartTitle}
      content={<HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    />
  );
}

// PropTypes: helps catch type errors and document the interface
PSABarChart.propTypes = {
  /** Categories displayed along the x-axis */
  categories: PropTypes.arrayOf(PropTypes.string),
  /**
   * Data for a single series.
   * An array of values (e.g., [5, 10, 3]) or an array of objects (e.g., [{ y: 5 }, { y: 10 }])
   */
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        y: PropTypes.number,
      }),
    ]),
  ),
  /** "vertical" for column chart, "horizontal" for bar chart */
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  /** The main title of the chart */
  chartTitle: PropTypes.string,
  /** The color of the bars/columns */
  color: PropTypes.string,
  /** The label for the x-axis */
  xAxisTitle: PropTypes.string,
  /** The label for the y-axis */
  yAxisTitle: PropTypes.string,
  /** Whether the chart is currently in loading state */
  loading: PropTypes.bool,
  /** The height of the chart in pixels */
  height: PropTypes.number,
  /**
   * Advanced options passed directly to Highcharts for further customization
   * (e.g., custom tooltips, multiple series, etc.).
   */
  additionalOptions: PropTypes.object,
};
