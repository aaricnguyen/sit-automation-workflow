import BarChartFeatureCount from '@/components/BarChartFeatureCount';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { includes, startCase } from 'lodash';
import { connect } from 'umi';
import axios from 'axios';
import { getExternalFeatureCountBySegment } from '@/services/configs';
import RadarChartScale from '../RadarChartScale';
import styles from './index.less';
import { TYPE_CHART } from '@/utils/constant';

let typeChart = 7;
const FeatureCountChartContainer = ({
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
  const [typeDisplay, setTypeDisplay] = useState('top20');
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
    FEATURE_COUNT_BAR_CHART,
  } = TYPE_CHART;

  const SEGMENT_MAP = {
    retail: 1,
    government: 2,
    healthcare: 3,
    nge: 4,
    education: 5,
    finance: 6,
    pe: 7,
    ngevpn: 8,
    sda: 9,
  };

  const idChart2 = chartHistories.find((item) => item.typeChart === INTERNAL_CHART)?.id;
  const idChart3 = chartHistories.find((item) => item.typeChart === CATEGORY_CHART)?.id;
  const category = chartHistories.find((item) => item.typeChart === FEATURE_CHART)?.id;

  // console.log("chart id: ", idChart2)
  // console.log("segment map: ", SEGMENT_MAP)

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
        <div className={styles.chartContainer__title}>{`${startCase(
          idChart2,
        )} - Top Feature Chart`}</div>
        {dataPaging.length > 0 && (
          <BarChartFeatureCount
            yLabel={'Feature Sum Number'}
            keyX={'cust_id'}
            setId={setId}
            chartData={typeDisplay === 'all' ? dataPaging : chartDataTopFea.slice(0, 20)}
            typeChart={7}
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
              setDataPaging(
                chartDataTopFea.slice((current - 1) * perPage, (current - 1) * perPage + perPage),
              );
            }}
          />
        )}
      </>
    );
  };

  let cust_segment = undefined;

  if (idChart2.toLowerCase() in SEGMENT_MAP) {
    cust_segment = SEGMENT_MAP[idChart2.toLowerCase()];
  }

  const handleGetDataChartTopFeature = async () => {
    if (cust_segment === undefined) {
      return;
    }
    const { data } = await getExternalFeatureCountBySegment({ cust_segment: cust_segment });
    let fdata = data['categories'];
    let totalConfigs = [];
    let chart_data = {};
    Object.values(fdata).forEach((element) => {
      totalConfigs.push(...element);
    });

    let feature_set = new Set(totalConfigs);
    let feature_list = [...feature_set];
    console.log('feature_list', feature_list);
    feature_list.forEach((feature) => {
      chart_data[feature] = {};
      chart_data[feature]['feature'] = feature;
      chart_data[feature]['sum'] = totalConfigs.filter((x) => x === feature).length;
    });

    console.log('chart data', chart_data);
    // console.log('total configs: ', totalConfigs)
    // fdata = fdata.sort((a, b) => b.sum - a.sum);
    // console.log("data: ", fdata);
    let fchart_data = Object.values(chart_data).sort((a, b) => b.sum - a.sum);

    setChartDataTopFea(
      fchart_data.map((i) => {
        return {
          cust_id: i.feature,
          value: i.sum,
        };
      }),
    );

    setDataPaging(
      fchart_data.slice(0, 20).map((i) => {
        return {
          cust_id: i.feature,
          value: i.sum,
        };
      }),
    );
  };

  useEffect(() => handleGetDataChartTopFeature(), []);

  return (
    <div className={styles.chartContainer}>
      <Row justify={typeChart === FEATURE_COUNT_BAR_CHART ? 'space-between' : 'end'}>
        {typeChart === FEATURE_COUNT_BAR_CHART && (
          <Select onChange={(e) => setTypeDisplay(e)} defaultValue={typeDisplay}>
            <Select.Option value="top20">Top 20</Select.Option>
            <Select.Option value="all">All</Select.Option>
          </Select>
        )}
      </Row>
      {loadingChart ? <PageLoading /> : <>{_renderChart()}</>}
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
)(React.memo(FeatureCountChartContainer));