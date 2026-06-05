import { PSAPiechart2 } from './piechart';

const meta = {
  title: 'Functional/PieChart',
  component: PSAPiechart2,
  tags: ['autodocs'],
};

export default meta;

export const PieChartExamples2 = {
  render: () => {
    const chartData = [
      { name: 'Category A', value: 40 },
      { name: 'Category B', value: 30 },
      { name: 'Category C', value: 20 },
      { name: 'Category D', value: 10 },
    ];

    return (
      <div style={{ width: '100%', boxSizing: 'border-box', padding: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <PSAPiechart2 chartData={chartData} label="Pie Chart" donut={false} />
          </div>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <PSAPiechart2 chartData={chartData} label="Donut Chart" donut={true} />
          </div>
        </div>
      </div>
    );
  },
};
