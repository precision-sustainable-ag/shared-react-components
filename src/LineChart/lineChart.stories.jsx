import React from "react";
import { PSALineChart } from "./lineChart";

const meta = {
  title: "Functional/LineChart",
  component: PSALineChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultLineChart = {
  args: {
    title: "Title of chart",
    xAxis: {
      title: "lbs per acre",
      categories: ["Jan", "Feb", "Mar", "Apr"],
    },
    yAxis: {
      title: "lbs per acre",
    },
    data: [
      {
        name: "data1",
        data: [25, 44, 35, 32],
      },
      {
        name: "data2",
        data: [11, 23, 35, 64],
      },
    ],
  },
};
