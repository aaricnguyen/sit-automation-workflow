import BarChartScale from '@/components/BarChartScale';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import { connect } from 'umi';
import RadarChartScale from '../RadarChartScale';
import styles from './index.less';
import { TYPE_CHART } from '@/utils/constant';

const ScaleChartContainer = ({
  chartScaleData,
  dispatch,
  typeChartScale,
  idScale,
  id,
  chartScaleHistories,
  chartHistories,
  loadingChart,
}) => {
  const numberOfChart = Object.keys(TYPE_CHART).length;
  // const [typeDisplay, setTypeDisplay] = useState('top10');
  // const [page, setPage] = useState(1);
  // const [perPage, setPerPage] = useState(20);
  const {
    // SIT_PROFILE_COMPARE,
    INTERNAL_CHART,
    CATEGORY_CHART,
    FEATURE_CHART,
    FEATURE_DETAIL_CHART,
  } = TYPE_CHART;
  const idChart2 = chartHistories.find((item) => item.typeChart === INTERNAL_CHART)?.id;
  const idChart3 = chartHistories.find((item) => item.typeChart === CATEGORY_CHART)?.id;
  const category = chartHistories.find((item) => item.typeChart === FEATURE_CHART)?.id;

  // useEffect(() => {
  //   let data = chartScaleHistories.find((item) => item.typeChartScale === typeChartScale);

  //   dispatch({
  //     type: 'dashboard/getScaleDataChart',
  //     payload: data,
  //   });
  // }, [idScale, typeChartScale]);

  const setId = (_id = '') => {
    if (typeChartScale === numberOfChart) return;

    const newchartScaleHistories = [...chartScaleHistories].filter(
      (item) => item.typeChartScale <= typeChartScale,
    );
    newchartScaleHistories.push({
      idScale: _id,
      typeChartScale: typeChartScale + 1,
    });

    dispatch({
      type: 'dashboard/save',
      payload: {
        idScale: _id,
        typeChartScale: typeChartScale + 1,
        chartScaleHistories: newchartScaleHistories,
      },
    });
  };

  const handlePrevious = () => {
    if (typeChartScale > 1 && typeChartScale <= numberOfChart) {
      const historyChart = chartScaleHistories.find(
        (item) => item.typeChartScale === typeChartScale - 1,
      );
      dispatch({
        type: 'dashboard/save',
        payload: historyChart,
      });
    }
  };

  const getYLabelOfChart = () => {
    switch (typeChartScale) {
      case 2:
        if (idScale !== 'others') return 'Match percentage (%)';
        return 'Number of configuration enabled';
      case 3:
        return 'Number of configuration enabled';
      default:
        return 'Number of customers';
    }
  };

  const keyOfChart = () => {
    switch (typeChartScale) {
      case 2:
        return 'category';
      case 3:
        return 'category';
      default:
        return 'cust_id';
    }
  };

  const _renderTitleChart = () => {
    switch (typeChartScale) {
      case 1:
        return `${startCase(idChart2)} - ${idChart3} - Scale Comparision`;
      case 2:
        return `${startCase(idChart2)} - ${idChart3} - ${idScale} - Scale Comparison`;
      default:
        return `${startCase(idChart2)} - ${idChart3} - Scale Comparision`;
    }
  };
  const _renderChart = () => {
    if (chartScaleData.length === 0 && typeChartScale !== 4) {
      return <div className={styles.noData}>No data to display</div>;
    }
    if (typeChartScale === 2) {
      return (
        <>
          <BarChartScale
            yLabel={getYLabelOfChart()}
            keyX={keyOfChart()}
            setId={setId}
            chartScaleData={chartScaleData}
            typeChartScale={typeChartScale}
            idChart2={idChart2}
            idChart3={idChart3}
          />
        </>
      );
    }
    return (
      <RadarChartScale
        idChart2={idChart2}
        setId={setId}
        keyX={keyOfChart()}
        idChart3={idChart3}
        chartScaleData={chartScaleData}
      />
    );
  };

  return (
    <div className={styles.chartContainer}>
      <Row justify="end">
        <div className={styles.chartContainer__actions}>
          <span
            onClick={() => handlePrevious()}
            className={
              typeChartScale <= chartScaleHistories[0].typeChartScale &&
              styles.chartContainer__actions__disabled
            }
          >
            Previous Chart
          </span>
        </div>
      </Row>
      {loadingChart ? (
        <PageLoading />
      ) : (
        <>
          <div className={styles.chartContainer__title}>{_renderTitleChart()}</div>
          {_renderChart()}
        </>
      )}
    </div>
  );
};

export default connect(
  ({
    dashboard: {
      chartScaleData = [],
      chartScaleHistories = [],
      chartHistories = [],
      typeChartScale = 1,
      idScale = '',
      id = '',
    },
    loading,
  }) => ({
    chartScaleData,
    typeChartScale,
    idScale,
    id,
    chartHistories,
    chartScaleHistories,
    loadingChart: loading.effects['dashboard/getDataChart'],
  }),
)(React.memo(ScaleChartContainer));
