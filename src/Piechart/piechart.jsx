import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { Square } from "@mui/icons-material";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@emotion/react';

/** Possible colors for the pie chart options */
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/** Format values for display */
const twoDigit = (value) => Number(parseFloat(value).toFixed(2));

/** Radians used for calculations */
const RADIAN = Math.PI / 180;


/** Labels each pie chart segment */
const PieChartLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

/** Labels the entire PSAPieChart  */
const PSAPieChartLabel = ({ label }) => (
  <Typography
    sx={{
      textAlign: 'center',
      textDecoration: 'underline #cccccc',
      textUnderlineOffset: '0.5rem',
      fontWeight: 600,
    }}
  >
    {label}
  </Typography>
);

/** Creates a legend for the Pie Chart */
const PSAPieChartLegend = ({ chartData }) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ p: '1rem 0' }}>
      {chartData.map((data, i) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: matchesMd ? '0.25rem 2%' : '0.25rem 15%',
          }}
          key={i}
        >
          <Typography
            fontSize={matchesMd ? '0.75rem' : '1rem'}
            sx={{ display: 'flex', alignItems: 'center' }}
            data-test="piechart_label"
          >
            <Square sx={{ color: COLORS[i] }} />
            {data.name}
          </Typography>
          <Typography
            fontSize={matchesMd ? '0.75rem' : '1rem'}
            sx={{ display: 'flex', alignItems: 'center' }}
            data-test="piechart_value"
          >
            {twoDigit(data.value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};


export function PSAPiechart({chartData, label,}) {
  return (
    <>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={PieChartLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    <PSAPieChartLabel label={label} />
    <PSAPieChartLegend chartData={chartData} />
  </>
  );
}

/* PSAPieChart Props */
PSAPiechart.propTypes = { 

  // Data to be used in the chart, exits in the following format
  // [ { name: 'Category A', value: 400 },
  // { name: 'Category B', value: 300 },
  // { name: 'Category C', value: 200 },
  // { name: 'Category D', value: 100 }, ]
  chartData: PropTypes.array,

  // Chart Label
  label: PropTypes.string,

};
