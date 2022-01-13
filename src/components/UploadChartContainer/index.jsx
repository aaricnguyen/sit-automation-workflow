import BarChart from '@/components/BarChart';
import { TYPE_CHART } from '@/utils/constant';
import { PageLoading } from '@ant-design/pro-layout';
import { Row } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import RadarChart from '../RadarChart';
import TableChart from '../TableChart';
import styles from './index.less';

const UploadChartContainer = ({
  chartData,
  totalConfigs,
  dispatch,
  typeChart,
  id,
  chartHistories,
  loadingChart,
  externalCustomerId,
  internalCustomerId,
  isUploadPage = false,
}) => {
  const numberOfChart = 5;
  const { CATEGORY_CHART, FEATURE_CHART, FEATURE_DETAIL_CHART } = TYPE_CHART;

  const idChart3 = externalCustomerId;
  const category = chartHistories.find((item) => item.typeChart === FEATURE_CHART)?.id;

  useEffect(() => {
    let data = chartHistories.find((item) => item.typeChart === typeChart);

    if (typeChart === 1) {
      data = {
        id: externalCustomerId,
      };
    } else if (typeChart === CATEGORY_CHART) {
      data = {
        ...data,
        internalId: id,
        id: externalCustomerId,
      };
      dispatch({
        type: 'config/save',
        payload: {
          internalCustomerId: id,
        },
      });
    } else if (typeChart === FEATURE_CHART) {
      data = {
        typeChart: FEATURE_CHART,
        category: data.id,
        id: externalCustomerId,
        internalId: internalCustomerId,
      };
    } else if (typeChart === FEATURE_DETAIL_CHART) {
      data = {
        ...data,
        category,
        externalId: idChart3,
        internalId: internalCustomerId,
      };
    }
    dispatch({
      type: 'config/getDataChart',
      payload: data,
    });
  }, [id, typeChart]);

  const setId = (_id = '') => {
    if (typeChart === numberOfChart) return;

    const newChartHistories = [...chartHistories].filter((item) => item.typeChart <= typeChart);
    const newTypeChart = typeChart === 1 ? 3 : typeChart + 1;

    newChartHistories.push({
      id: _id,
      typeChart: newTypeChart,
    });

    dispatch({
      type: 'config/save',
      payload: {
        id: _id,
        typeChart: newTypeChart,
        chartHistories: newChartHistories,
      },
    });
  };

  const handlePrevious = () => {
    if (typeChart > 1 && typeChart <= numberOfChart) {
      const prevTypeChart = typeChart === 3 ? 1 : typeChart - 1;
      const historyChart = chartHistories.find((item) => item.typeChart === prevTypeChart);
      dispatch({
        type: 'config/save',
        payload: historyChart,
      });
    }
  };

  const handleNext = () => {
    if (typeChart >= 1 && typeChart <= numberOfChart) {
      const nextTypeChart = typeChart === 1 ? 3 : typeChart + 1;
      const historyChart = chartHistories.find((item) => item.typeChart === nextTypeChart);
      dispatch({
        type: 'config/save',
        payload: historyChart,
      });
    }
  };

  const getYLabelOfChart = () => {
    switch (typeChart) {
      case 3:
        return 'Number of configuration enabled';
      default:
        return 'Match percentage (%)';
    }
  };

  const getDomain = () => {
    if (typeChart === 1) {
      return [0, 100];
    }
    return ['auto', 'auto'];
  };

  const keyOfChart = () => {
    switch (typeChart) {
      case 3:
        return 'category';
      default:
        return 'cust_id';
    }
  };

  const _renderTitleChart = () => {
    switch (typeChart) {
      case 3:
        return `${startCase(internalCustomerId)} - ${externalCustomerId} - Features Comparison`;
      case 4:
        return `${startCase(internalCustomerId)} - ${idChart3} - ${startCase(id)} Comparison`;
      case 5:
        return `${startCase(internalCustomerId)} - ${idChart3} - ${startCase(
          category,
        )} - ${id} Configurations`;
      default:
        return `${
          isUploadPage ? 'New ' : ''
        }Customer ${externalCustomerId} - SIT Profiles Comparison`;
    }
  };

  const _renderChart = () => {
    if (chartData.length === 0 && typeChart !== 4) {
      return <div className={styles.noData}>No data to display</div>;
    }

    switch (typeChart) {
      case 3:
        return (
          <RadarChart
            idChart2={internalCustomerId}
            setId={setId}
            keyX={keyOfChart()}
            idChart3={idChart3}
            chartData={chartData}
          />
        );

      case FEATURE_CHART:
      case FEATURE_DETAIL_CHART:
        return <TableChart typeChart={typeChart} setId={setId} data={chartData} />;

      default:
        return (
          <>
            <BarChart
              yLabel={getYLabelOfChart()}
              keyX={keyOfChart()}
              setId={setId}
              chartData={chartData}
              typeChart={typeChart}
              totalConfigs={totalConfigs}
              domain={getDomain()}
              internalCustomerId={internalCustomerId}
              idChart3={idChart3}
            />
          </>
        );
    }
  };

  return (
    <div className={styles.chartContainer}>
      <Row justify="end">
        <div className={styles.chartContainer__actions}>
          <span
            onClick={() => handlePrevious()}
            className={typeChart <= 1 && styles.chartContainer__actions__disabled}
          >
            Previous
          </span>
          <span
            onClick={() => handleNext()}
            className={
              typeChart !== 4 &&
              typeChart >= chartHistories.length &&
              styles.chartContainer__actions__disabled
            }
          >
            Next
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
      chartData = [],
      chartHistories = [],
      typeChart = 1,
      id = '',
      externalCustomerId = null,
      internalCustomerId = null,
    },
    loading,
  }) => ({
    chartData,
    externalCustomerId,
    internalCustomerId,
    typeChart,
    id,
    chartHistories,
    loadingChart: loading.effects['config/getDataChart'],
  }),
)(React.memo(UploadChartContainer));
