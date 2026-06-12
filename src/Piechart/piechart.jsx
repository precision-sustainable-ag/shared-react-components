import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import * as XLSX from 'xlsx';
import PSASubContainer from '../SubContainer';

const COLORS = [
  '#2caffe',
  '#544fc5',
  '#00e272',
  '#fe6a35',
  '#6b8abc',
  '#d568fb',
  '#2ee0ca',
  '#fa4b42',
  '#feb56a',
  '#91e8e1',
];

const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, smallChart }) => {
  if (cx == null || cy == null || midAngle == null || outerRadius == null || percent == null) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + (smallChart ? 4 : 8);

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fill="#000"
      stroke="#fff"
      strokeWidth={1}
      paintOrder="stroke"
    >
      {(percent * 100).toFixed(smallChart ? 0 : 1)}%
    </text>
  );
};

export const PSAPiechart = ({
  chartData = [],
  label,
  donut = true,
  footer,
  animate = true,
  width = '100%',
  height = 220,
}) => {
  const handlePrint = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: '#ffffff',
      });

      const printWindow = window.open('', '_blank');

      printWindow.document.write(`
      <html>
        <head>
          <title>${label}</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }

            img {
              max-width: 100%;
              height: auto;
            }

            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);

      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    } catch (err) {
      console.error(err);
    }
  };

  const IMAGE_EXPORTERS = {
    png: (node) => toPng(node, { backgroundColor: '#fff' }),
    jpeg: (node) => toJpeg(node, { quality: 0.95, backgroundColor: '#fff' }),
    svg: (node) => toSvg(node),
  };

  const downloadImage = async (type) => {
    const dataUrl = await IMAGE_EXPORTERS[type](chartRef.current);

    const link = document.createElement('a');
    link.download = `${label}.${type === 'jpeg' ? 'jpg' : type}`;
    link.href = dataUrl;
    link.click();
  };

  const downloadCsv = () => {
    const csv = ['Category,Value', ...chartData.map((d) => `${d.name},${d.value}`)].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${label}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadXlsx = () => {
    const worksheet = XLSX.utils.json_to_sheet(chartData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    XLSX.writeFile(workbook, `${label}.xlsx`);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const chartRef = useRef(null);

  const handleFullscreen = () => {
    chartRef.current?.requestFullscreen();
  };

  const [smallChart, setSmallChart] = useState(false);

  const [chartKey, setChartKey] = useState(0);

  const [activeIndex, setActiveIndex] = useState(-1);

  const hasAnimatedRef = useRef(!animate);

  return (
    <Box sx={{ width }}>
      <PSASubContainer
        title={label}
        content={
          <Box
            ref={chartRef}
            sx={{
              position: 'relative',
              width: '100%',
              '& .recharts-tooltip-item-value': { fontWeight: 'bold' },
              '&:fullscreen': {
                bgcolor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
                p: 4,
              },
            }}
          >
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ '& .MuiMenuItem-root': { fontSize: 12 } }}
            >
              <MenuItem onClick={handleFullscreen}>View in full screen</MenuItem>

              <MenuItem onClick={handlePrint}>Print chart</MenuItem>

              <Divider />

              <MenuItem onClick={() => downloadImage('png')}>Download PNG image</MenuItem>

              <MenuItem onClick={() => downloadImage('jpeg')}>Download JPEG image</MenuItem>

              <MenuItem onClick={() => downloadImage('svg')}>Download SVG vector image</MenuItem>
              <Divider />

              <MenuItem onClick={downloadCsv}>Download CSV</MenuItem>
              <MenuItem onClick={downloadXlsx}>Download Excel</MenuItem>
            </Menu>

            <ResponsiveContainer
              width="100%"
              height={height}
              debounce={50}
              onResize={(width) => {
                if (width > 0) {
                  setSmallChart(width < 300);
                  setChartKey((current) => current + 1);
                }
              }}
            >
              <PieChart key={chartKey} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
                <Pie
                  isAnimationActive={!hasAnimatedRef.current}
                  animationDuration={1000}
                  onAnimationEnd={() => {
                    hasAnimatedRef.current = true;
                  }}
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx={smallChart ? '50%' : '40%'}
                  cy={smallChart ? '38%' : '50%'}
                  innerRadius={donut ? 48 : 0}
                  outerRadius={smallChart ? 58 : 68}
                  label={(props) => renderLabel({ ...props, smallChart })}
                  labelLine={false}
                  activeIndex={activeIndex}
                  // activeShape={(props) => <Sector {...props} outerRadius={props.outerRadius + 8} />}
                  activeShape={(props) => (
                    <g>
                      <Sector
                        {...props}
                        outerRadius={props.outerRadius + 10}
                        fill={props.fill}
                        opacity={0.25}
                      />

                      <Sector {...props} />
                    </g>
                  )}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={activeIndex === -1 || activeIndex === index ? 1 : 0.3}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  itemStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
                  formatter={(_value, name, props) => {
                    const total = chartData.reduce((sum, item) => sum + item.value, 0);
                    const percent = total ? (props.payload.value / total) * 100 : 0;

                    return [`${percent.toFixed(1)}%`, name];
                  }}
                />
                <Legend
                  layout="vertical"
                  align={smallChart ? 'center' : 'right'}
                  verticalAlign={smallChart ? 'bottom' : 'middle'}
                  wrapperStyle={{
                    fontSize: 12,
                    lineHeight: '18px',
                    maxHeight: smallChart ? 60 : undefined,
                  }}
                  onMouseEnter={(_data, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                />
              </PieChart>
            </ResponsiveContainer>
            {footer && <Box sx={{ mt: 2, p: 1, fontSize: 12 }}>{footer}</Box>}
          </Box>
        }
      />
    </Box>
  );
};

PSAPiechart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ).isRequired,
  label: PropTypes.string.isRequired,
  footer: PropTypes.node,
  donut: PropTypes.bool,
  animate: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
