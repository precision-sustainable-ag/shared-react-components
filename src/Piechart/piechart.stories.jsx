import { PSAPiechart } from './piechart';

const meta = {
  title: 'Functional/PieChart',
  component: PSAPiechart,
  tags: ['autodocs'],
};

export default meta;

const chartData = [
  { name: 'Category A', value: 40 },
  { name: 'Category B', value: 30 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 10 },
];

const width = 400;

export const Default = {
  render: (args) => <PSAPiechart {...args} />,
  args: {
    chartData,
    label: 'Donut Chart',
    width,
  },
};

export const BasicPie = {
  render: (args) => <PSAPiechart {...args} />,
  args: {
    chartData,
    label: 'Pie Chart',
    donut: false,
    footer: 'Data as of 2024',
    width,
  },
};

export const BasicPieNonAnimated = {
  render: (args) => <PSAPiechart {...args} />,
  args: {
    chartData,
    label: 'Pie Chart Non-Animated',
    donut: false,
    footer: 'Data as of 2024',
    animate: false,
    width,
  },
};
