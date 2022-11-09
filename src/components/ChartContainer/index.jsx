import BarChart from '@/components/BarChart';
import BarChartFeature from '@/components/BarChartFeature';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import RadarChart from '../RadarChart';
import TableChart from '../TableChart';
import styles from './index.less';
import { TYPE_CHART } from '@/utils/constant';
import axios from 'axios';

const ChartContainer = ({
  chartData,
  totalConfigs,
  dispatch,
  typeChart,
  typeChartScale,
  pagination,
  id,
  idScale,
  chartHistories,
  loadingChart,
}) => {
  const numberOfChart = Object.keys(TYPE_CHART).length;
  const [typeDisplay, setTypeDisplay] = useState('top10');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const {
    // SIT_PROFILE_COMPARE,
    INTERNAL_CHART,
    CATEGORY_CHART,
    FEATURE_CHART,
    FEATURE_DETAIL_CHART,
    FEATURE_BAR_CHART,
    FEATURE_COUNT_BAR_CHART,
  } = TYPE_CHART;

  const idChart2 = chartHistories.find((item) => item.typeChart === INTERNAL_CHART)?.id;
  const idChart3 = chartHistories.find((item) => item.typeChart === CATEGORY_CHART)?.id;
  const category = chartHistories.find((item) => item.typeChart === FEATURE_CHART)?.id;
  useEffect(() => {
    let data = chartHistories.find((item) => item.typeChart === typeChart);

    if (typeChart === INTERNAL_CHART) {
      data = {
        ...data,
        typeDisplay,
        _page: page,
        _perPage: perPage,
      };
    }
    if (typeChart === CATEGORY_CHART) {
      data = {
        ...data,
        internalId: idChart2,
        typeChartScale,
        idScale,
      };
    } else if (typeChart === FEATURE_CHART) {
      data = {
        typeChart: FEATURE_CHART,
        category: data.id,
        id: idChart3,
        internalId: idChart2,
        typeChartScale,
        idScale,
      };
    } else if (typeChart === FEATURE_DETAIL_CHART) {
      data = {
        ...data,
        category,
        externalId: idChart3,
        internalId: idChart2,
        typeChartScale,
        idScale,
      };
    } else if (typeChart === FEATURE_BAR_CHART) {
      data = {
        ...data,
        category,
        externalId: idChart2,
        typeChartScale,
        idScale,
      };
    } else if (typeChart === FEATURE_COUNT_BAR_CHART) {
      data = {
        ...data,
        category,
        externalId: idChart2,
        typeChartScale,
        idScale,
      };
    }
    dispatch({
      type: 'dashboard/getDataChart',
      payload: data,
    });
  }, [id, typeChart, typeDisplay, page, perPage, typeChartScale]);

  const setId = (_id = '') => {
    if (typeChart === numberOfChart) return;

    const newChartHistories = [...chartHistories].filter((item) => item.typeChart <= typeChart);
    newChartHistories.push({
      id: _id,
      typeChart: typeChart + 1,
    });

    dispatch({
      type: 'dashboard/save',
      payload: {
        id: _id,
        typeChart: typeChart + 1,
        chartHistories: newChartHistories,
      },
    });
  };

  const handlePrevious = () => {
    if (typeChart > 1 && typeChart <= numberOfChart) {
      if (typeChart === 2) {
        setTypeDisplay('top10');
        setPage(1);
        setPerPage(20);
      }

      const historyChart = chartHistories.find((item) => item.typeChart === typeChart - 1);
      dispatch({
        type: 'dashboard/save',
        payload: historyChart,
      });
    }
  };

  const handleNext = () => {
    if (typeChart >= 1 && typeChart <= numberOfChart) {
      if (typeChart === 2) {
        setTypeDisplay('top10');
        setPage(1);
        setPerPage(20);
      }
      const historyChart = chartHistories.find((item) => item.typeChart === typeChart + 1);
      dispatch({
        type: 'dashboard/save',
        payload: historyChart,
      });
    }
  };

  const getYLabelOfChart = () => {
    switch (typeChart) {
      case 2:
        if (id !== 'others') return 'Match percentage (%)';
        return 'Number of configuration enabled';
      case 3:
        return 'Number of configuration enabled';
      case 6:
        return 'Feature Count';
      default:
        return 'Number of customers';
    }
  };

  const keyOfChart = () => {
    switch (typeChart) {
      case 3:
        return 'category';
      default:
        return 'cust_id';
    }
  };

  const getDomain = () => {
    if (typeChart === INTERNAL_CHART) {
      if (id === 'others') return [0, totalConfigs];
      return [0, 100];
    }
    return ['auto', 'auto'];
  };

  const _renderTitleChart = () => {
    switch (typeChart) {
      case 2:
        if (typeDisplay === 'all') return `${startCase(id)} Customers`;
        return `Top ${startCase(id)} Customers`;
      case 3:
        return `${startCase(idChart2)} - ${id} - Features Comparison`;
      case 4:
        return `${startCase(idChart2)} - ${idChart3} - ${startCase(id)} Comparison`;
      case 5:
        return `${startCase(idChart2)} - ${idChart3} - ${startCase(
          category,
        )} - ${id} Configurations`;
      case 6:
        return 'Top Features Chart';
      default:
        return 'SIT Profiles - Internal Customers Summary';
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
            idChart2={idChart2}
            setId={setId}
            keyX={keyOfChart()}
            idChart3={idChart3}
            chartData={chartData}
          />
        );

      case 4:
      case 5:
        return <TableChart typeChart={typeChart} setId={setId} data={chartData} />;
      // case 6:
      //   return (
      //     <>
      //       <BarChartFeature
      //         yLabel={getYLabelOfChart()}
      //         keyX={keyOfChart()}
      //         setId={setId}
      //         // chartData={typeDisplay === 'all' ? dataPaging : chartDataTopFea.slice(0, 10)}
      //         chartData={chartDataTopFea}
      //         typeChart={typeChart}
      //         totalConfigs={totalConfigs}
      //         key={dataPaging.length}
      //         domain={getDomain()}
      //       />
      //       {typeChart === 6 && typeDisplay === 'all' && (
      //         <Pagination
      //           className={styles.pagination}
      //           showSizeChanger={false}
      //           responsive={true}
      //           total={pagination._total}
      //           showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      //           defaultPageSize={perPage}
      //           defaultCurrent={page}
      //           // showQuickJumper
      //           onChange={(current) => setPage(current)}
      //         />
      //       )}
      //     </>
      //   )
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
              idChart2={idChart2}
              idChart3={idChart3}
            />
            {typeChart === 2 && typeDisplay === 'all' && (
              <Pagination
                className={styles.pagination}
                showSizeChanger={false}
                responsive={true}
                total={pagination._total}
                // total={chartData.length}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                defaultPageSize={perPage}
                defaultCurrent={page}
                // showQuickJumper
                onChange={(current) => setPage(current)}
              />
            )}
          </>
        );
    }
  };
  return (
    <div className={styles.chartContainer}>
      <Row justify={typeChart === INTERNAL_CHART ? 'space-between' : 'end'}>
        {typeChart === INTERNAL_CHART && (
          <Select onChange={(e) => setTypeDisplay(e)} defaultValue={typeDisplay}>
            <Select.Option value="top10">Top 10</Select.Option>
            <Select.Option value="all">All</Select.Option>
          </Select>
        )}
        <div className={styles.chartContainer__actions}>
          <span
            onClick={() => handlePrevious()}
            className={
              typeChart <= chartHistories[0].typeChart && styles.chartContainer__actions__disabled
            }
          >
            Previous
          </span>
          <span
            onClick={() => handleNext()}
            className={
              typeChart >= chartHistories[chartHistories.length - 1].typeChart &&
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
    dashboard: {
      chartData = [],
      chartHistories = [],
      typeChart = 1,
      typeChartScale = 1,
      id = '',
      idScale = '',
      pagination,
      overviewList: { totalConfigs = 0 },
    },
    loading,
  }) => ({
    chartData,
    pagination,
    typeChart,
    typeChartScale,
    id,
    idScale,
    chartHistories,
    totalConfigs,
    loadingChart: loading.effects['dashboard/getDataChart'],
  }),
)(React.memo(ChartContainer));
