import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  Legend,
} from 'recharts';
import { startCase } from 'lodash';
import './index.less';
// #00A0D1

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip__item">
          <span>Feature:</span>
          <span>{startCase(label)}</span>
        </div>
        <div className="custom-tooltip__item">
          <span>Applying:</span>
          <span>{data.value} %</span>
        </div>
      </div>
    );
  }

  return null;
};

export default function HorizontalBarChartFeatureCount({
  chartData = [],
  setId = () => {},
  keyX = 'feature',
}) {
  return (
    <div className="chartResponsive">
      <ResponsiveContainer
        width="100%"
        height={500}
        onClick={(props) => {
          if (props) setId(props.activePayload[0].payload[keyX]);
        }}
      >
        <BarChart
          // width={500}
          // height={300}
          data={chartData}
          margin={{ top: 20, right: 20, left: 80, bottom: 5 }}
          layout="vertical"
          barSize={15}
          maxBarSize={15}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="cust_id" interval={0} />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey={'value'} stackId="a" fill={`#00A0D1`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
