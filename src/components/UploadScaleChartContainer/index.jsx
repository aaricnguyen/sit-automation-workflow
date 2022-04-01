import BarChartScale from '@/components/BarChartScale';
import { TYPE_CHART } from '@/utils/constant';
import { PageLoading } from '@ant-design/pro-layout';
import { Row } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import RadarChartScale from '../RadarChartScale';
import styles from './index.less';

const UploadScaleChartContainer = ({
  dispatch,
  typeChartScale,
  id,
  idScale,
  chartHistories,
  loadingChart,
  externalCustomerId,
  internalCustomerId,
  chartDataScale,
  chartScaleHistories,
  isUploadPage = false,
}) => {
  const numberOfChart = 5;
  const { CATEGORY_CHART, FEATURE_CHART, FEATURE_DETAIL_CHART } = TYPE_CHART;

  const idChart3 = externalCustomerId;
  const category = chartHistories.find((item) => item.typeChartScale === FEATURE_CHART)?.id;

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
      type: 'config/save',
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
        type: 'config/save',
        payload: {
          typeChartScale: typeChartScale - 1,
        },
      });
    }
  };

  const getYLabelOfChart = () => {
    switch (typeChartScale) {
      case 3:
        return 'Number of configuration enabled';
      default:
        // return 'Match percentage (%)';
        return 'Customer Score';
    }
  };

  const getDomain = () => {
    if (typeChartScale === 1) {
      return [0, 100];
    }
    return ['auto', 'auto'];
  };

  const keyOfChart = () => {
    switch (typeChartScale) {
      case 3:
        return 'category';
      default:
        return 'cust_id';
    }
  };

  const _renderTitleChart = () => {
    switch (typeChartScale) {
      case 1:
        return `${startCase(internalCustomerId)} - ${externalCustomerId} - Scale Comparision`;
      case 2:
        return `${startCase(
          internalCustomerId,
        )} - ${externalCustomerId} - ${idScale} - Scale Comparison`;
      default:
        return `${startCase(internalCustomerId)} - ${idChart3} Scale Comparision`;
    }
  };

  const _renderChart = () => {
    if (chartDataScale.length === 0 && typeChartScale !== 4) {
      return <div className={styles.noData}>No data to display</div>;
    }
    console.log(typeChartScale);
    if (typeChartScale === 2) {
      return (
        <>
          <BarChartScale
            yLabel={getYLabelOfChart()}
            keyX={keyOfChart()}
            setId={setId}
            chartScaleData={chartDataScale}
            typeChartScale={typeChartScale}
            idChart2={internalCustomerId}
          />
        </>
      );
    }
    return (
      <RadarChartScale
        idChart2={internalCustomerId}
        setId={setId}
        keyX={keyOfChart()}
        idChart3={idChart3}
        chartScaleData={chartDataScale}
      />
    );
  };

  return (
    <div className={styles.chartContainer}>
      <Row justify="end">
        <div className={styles.chartContainer__actions}>
          <span
            onClick={() => handlePrevious()}
            className={typeChartScale <= 1 && styles.chartContainer__actions__disabled}
          >
            Previous
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
    config: {
      chartHistories = [],
      chartDataScale = [],
      chartScaleHistories = [],
      typeChartScale = 1,
      id = '',
      idScale = '',
      externalCustomerId = null,
      internalCustomerId = null,
    },
    loading,
  }) => ({
    externalCustomerId,
    internalCustomerId,
    typeChartScale,
    id,
    idScale,
    chartHistories,
    chartScaleHistories,
    chartDataScale,
    loadingChart: loading.effects['config/getDataChart'],
  }),
)(React.memo(UploadScaleChartContainer));
