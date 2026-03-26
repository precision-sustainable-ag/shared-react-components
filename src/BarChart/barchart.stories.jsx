import { PSABarChart } from './barchart';

export default {
  title: 'Functional/BarChart',
  component: PSABarChart,
  tags: ['autodocs'],
};

const commonArgs = {
  categories: ['Test A', 'Test B', 'Test C', 'Test D'],
  data: [50, 80, 70, 55],
  height: 400,
  xAxisTitle: 'Categories',
  yAxisTitle: 'Values',
};

export const DefaultVerticalChart = {
  args: {
    ...commonArgs,
    orientation: 'vertical',
    chartTitle: 'Vertical Bar Chart',
  },
};

export const HorizontalChart = {
  args: {
    ...commonArgs,
    orientation: 'horizontal',
    chartTitle: 'Horizontal Bar Chart',
    height: 400,
  },
};
