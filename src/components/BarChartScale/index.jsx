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
  // setId = () => {},
  // yLabel = '',
  // keyX = 'cust_id',
  // domain = ['auto', 'auto'],
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
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            height={200}
            angle={-45}
            tickLine={false}
            dataKey="category"
            textAnchor={'end'}
            verticalAnchor="end"
            width={200}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="External Custommer" dataKey="value" fill="#BD10E0" />
          <Bar name="Internal Custommer" dataKey="internalValue" fill="#00A0D1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
