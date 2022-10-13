import BarChartFeature from '@/components/BarChartFeature';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import { connect } from 'umi';
import axios from 'axios';
import RadarChartScale from '../RadarChartScale';
import styles from './index.less';
import { TYPE_CHART } from '@/utils/constant';

let typeChart = 6;
const FeatureChartContainer = ({
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
  const [typeDisplay, setTypeDisplay] = useState('top10');
  const [chartDataTopFea, setChartDataTopFea] = useState([]);
  const [dataPaging, setDataPaging] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const {
    // SIT_PROFILE_COMPARE,
    INTERNAL_CHART,
    CATEGORY_CHART,
    FEATURE_CHART,
    FEATURE_DETAIL_CHART,
    FEATURE_BAR_CHART,
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
    if (chartDataTopFea.length === 0) {
      return <div className={styles.noData}>No data to display</div>;
    }
    return (
      <>
        <div className={styles.chartContainer__title}>{'Top Features Chart'}</div>
        {dataPaging.length > 0 && (
          <BarChartFeature
            yLabel={'Feature Count'}
            keyX={keyOfChart()}
            setId={setId}
            chartData={typeDisplay === 'all' ? dataPaging : chartDataTopFea.slice(0, 10)}
            typeChart={6}
            // totalConfigs={totalConfigs}
            key={dataPaging.length}
            // domain={getDomain()}
          />
        )}
        {typeDisplay === 'all' && (
          <Pagination
            className={styles.pagination}
            showSizeChanger={false}
            responsive={true}
            total={chartDataTopFea.length}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={perPage}
            defaultCurrent={page}
            // showQuickJumper
            onChange={(current) => {
              setPage(current);
              setDataPaging(chartDataTopFea.slice(current * perPage, current * perPage + perPage));
            }}
          />
        )}
      </>
    );
  };

  // return (
  //   <div className={styles.chartContainer}>
  //     <Row justify="end">
  //       <div className={styles.chartContainer__actions}>
  //         <span
  //           onClick={() => handlePrevious()}
  //           className={
  //             typeChartScale <= chartScaleHistories[0].typeChartScale &&
  //             styles.chartContainer__actions__disabled
  //           }
  //         >
  //           Previous Chart
  //         </span>
  //       </div>
  //     </Row>
  //     {loadingChart ? (
  //       <PageLoading />
  //     ) : (
  //       <>
  //         <div className={styles.chartContainer__title}>{_renderTitleChart()}</div>
  //         {_renderChart()}
  //       </>
  //     )}
  //   </div>
  // );

  const getDataChartTopFeature = async () => {
    await axios({
      url: 'http://10.78.96.78:5010/api/custom_features?custom_segment=4',
      method: 'GET',
      redirect: 'follow',
    }).then((result) => {
      setChartDataTopFea(
        result.data.map((i) => {
          return {
            cust_id: i.featureName,
            value: i.count,
          };
        }),
      );
      setDataPaging(
        result.data.slice(0, 20).map((i) => {
          return {
            cust_id: i.featureName,
            value: i.count,
          };
        }),
      );
    });
  };

  useEffect(() => getDataChartTopFeature(), []);

  // console.log('new====', dataPaging);
  return (
    <div className={styles.chartContainer}>
      <Row justify={typeChart === FEATURE_BAR_CHART ? 'space-between' : 'end'}>
        {typeChart === FEATURE_BAR_CHART && (
          <Select onChange={(e) => setTypeDisplay(e)} defaultValue={typeDisplay}>
            <Select.Option value="top10">Top 10</Select.Option>
            <Select.Option value="all">All</Select.Option>
          </Select>
        )}
        {/* <div className={styles.chartContainer__actions}>
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
          <span
            onClick={() => handlePrevious()}
            className={
              typeChart <= chartHistories[0].typeChart && styles.chartContainer__actions__disabled
            }
          >
            Previous Chart
          </span>
        </div> */}
      </Row>
      {loadingChart ? (
        <PageLoading />
      ) : (
        <>
          {/* <div className={styles.chartContainer__title}>{_renderTitleChart()}</div> */}
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
)(React.memo(FeatureChartContainer));
