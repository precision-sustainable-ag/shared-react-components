import React from "react";
import { PSAPiechart } from "./piechart";

const meta = {
  title: "Functional/PieChart",
  component: PSAPiechart,
  tags: ["autodocs"],
};

export default meta;

export const AllSizes = () => {
  const chartData = [
    { name: "Category A", value: 40 },
    { name: "Category B", value: 30 },
    { name: "Category C", value: 20 },
    { name: "Category D", value: 10 },
  ];

  return (
    <div>
      <h3>Small Size (3 Charts)</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <PSAPiechart chartData={chartData} label="Small Chart 1" size="small" />
        <PSAPiechart chartData={chartData} label="Small Chart 2" size="small" />
        <PSAPiechart chartData={chartData} label="Small Chart 3" size="small" />
      </div>

      <h3>Medium Size (2 Charts)</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <PSAPiechart chartData={chartData} label="Medium Chart 1" size="medium" />
        <PSAPiechart chartData={chartData} label="Medium Chart 2" size="medium" />
      </div>

      <h3>Large Size (1 Chart)</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PSAPiechart chartData={chartData} label="Large Chart" size="large" />
      </div>
    </div>
  );
};
