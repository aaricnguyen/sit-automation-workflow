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

export default function RadarChartItem({
  chartData = [],
  idChart2,
  idChart3,
  setId = () => {},
  keyX = 'category',
  props,
}) {
  return (
    <>
      <ResponsiveContainer width="100%" height={450}>
        <RadarChart
          onClick={(props) => {
            if (props) {
              setId(props.activePayload[0].payload[keyX]);
            }
          }}
          margin={{ bottom: '-25px' }}
          outerRadius={150}
          data={chartData}
        >
          <PolarGrid />
          <PolarAngleAxis tickFormatter={(e) => startCase(e)} dataKey="category" />
          <PolarRadiusAxis angle={90 - (360 / 13) * 2} />
          <Radar
            name={`External Customer: ${idChart3}`}
            dataKey="value"
            stroke="#BD10E0"
            strokeWidth="2"
            fill="#BD10E0"
            fillOpacity={0}
          />
          {/* <Radar
            name={`Internal Customer: ${idChart2}`}
            dataKey="internalValue"
            stroke="#00A0D1"
            strokeWidth="2"
            fill="#00A0D1"
            fillOpacity={0}
          />
          <Radar
            name={`No Match`}
            dataKey="noMatchValue"
            stroke="red"
            strokeWidth="2"
            fill="red"
            fillOpacity={0.5}
          /> */}
          <Tooltip
            formatter={(value, key) => {
              if (key.includes('No Match')) return [value, key];
              if (key.includes('Internal')) return [value, `Customer ${startCase(idChart2)}`];
              return [value, `Customer ${startCase(idChart3)}`];
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
