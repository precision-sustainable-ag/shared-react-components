import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import React from 'react';
import Highcharts from '../../utils/highchartsConfig';
import PSASubContainer from '../SubContainer';

export const PSAPiechart = ({ chartData, label, donut = true }) => {
  const options = {
    chart: {
      type: 'pie',
      height: 200,
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    legend: {
      margin: -10,
      padding: 0,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        innerSize: donut ? '80%' : '0%',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%',
          connectorWidth: 0,
          distance: 0,
          style: {
            fontSize: '14px',
            fontWeight: 'normal',
          },
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: 'Share',
        colorByPoint: true,
        data: chartData.map((data) => ({
          name: data.name,
          y: data.value,
        })),
      },
    ],
    responsive: {
      rules: [
        {
          // when width < 300, use following chart options
          condition: {
            maxWidth: 300,
          },
          chartOptions: {
            legend: {
              layout: 'vertical',
              align: 'center',
              verticalAlign: 'bottom',
              maxHeight: 60,
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  format: '{point.percentage:.0f}%',
                },
              },
            },
          },
        },
      ],
    },
  };

  return (
    <PSASubContainer
      title={label}
      content={<HighchartsReact highcharts={Highcharts} options={options} />}
    />
  );
};

PSAPiechart.propTypes = {
  /** Array of objects with `name` (string) and `value` (number) for pie chart data */
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  /** Title of the chart */
  label: PropTypes.string,
  /** Indicates if the chart should render as a donut (true) or standard pie chart (false) */
  donut: PropTypes.bool,
};
