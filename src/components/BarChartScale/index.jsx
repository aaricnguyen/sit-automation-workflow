import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function BarChartScaleItem({
  chartScaleData = [],
  key1,
  key2,
  name1,
  name2,
  barSize,
  maxBarSize,
  yLabel,
  keyX,
  domain = ['auto', 'auto'],
  // setId = () => {},
  // yLabel = '',
  // keyX = 'cust_id',
  // typeChartScale = 1,
  // idChart2 = null,
  // idChart3 = null,
}) {
  const [width, setWidth] = React.useState(window.innerWidth);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  const isAngle = width >= 600 && chartScaleData.length <= 6;
  const isReponsiveBar = width <= 700 && chartScaleData.length > 10;
  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);
  return (
    <div className="chartResponsive">
      <ResponsiveContainer width={'100%'} height={500}>
        <BarChart
          width={900}
          height={400}
          data={chartScaleData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={barSize ? barSize : 'auto'}
          maxBarSize={maxBarSize ? barSize : 'auto'}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            height={200}
            angle={-45}
            tickLine={false}
            dataKey={keyX ? keyX : 'category'}
            textAnchor={'end'}
            verticalAnchor="end"
            width={200}
            interval={0}
          />
          <YAxis
            domain={domain}
            tickLine={false}
            axisLine={false}
            label={{
              value: yLabel,
              angle: -90,
              position: 'left',
              offset: 0,
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip />
          <Legend />
          <Bar
            name={name1 ? name1 : 'External Custommer'}
            dataKey={key1 ? key1 : 'value'}
            fill="#BD10E0"
          />
          <Bar
            name={name2 ? name2 : 'Internal Custommer'}
            dataKey={key2 ? key2 : 'internalValue'}
            fill="#00A0D1"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
