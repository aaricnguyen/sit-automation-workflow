import { startCase } from 'lodash';
import React from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function RadarChartScaleItem({
  chartScaleData = [],
  idChart2,
  idChart3,
  setId = () => {},
  keyX = 'category',
  onClick = () => {},
}) {
  console.log(chartScaleData);
  return (
    <>
      <ResponsiveContainer width="100%" height={450}>
        <RadarChart
          onClick={(props) => {
            if (onClick) {
              onClick(props);
            }
          }}
          margin={{ bottom: '-25px' }}
          outerRadius={150}
          data={chartScaleData}
        >
          <PolarGrid />
          <PolarAngleAxis tickFormatter={(e) => startCase(e)} dataKey="category" />
          <PolarRadiusAxis angle={90 - (360 / 13) * 2} />
          <Radar
            name={idChart2}
            dataKey="value"
            stroke="#BD10E0"
            strokeWidth="2"
            fill="#BD10E0"
            fillOpacity={0}
          />

          {/* <Radar
            name={`Internal Customer`}
            dataKey="internalValue"
            stroke="#00A0D1"
            strokeWidth="2"
            fill="#00A0D1"
            fillOpacity={0}
          /> */}

          <Tooltip
            formatter={(value, key) => {
              if (key.includes('No Match')) return [value, key];
              if (key.includes('Internal')) return [value, `Internal Customer`];
              return [value, `Total config`];
            }}
            labelFormatter={(e) => startCase(e)}
          />

          <Legend
            wrapperStyle={{
              paddingTop: '15px',
              paddingBottom: '15px',
            }}
            layout="vertical"
            iconType="plainline"
          />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}
