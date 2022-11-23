import BarChartFeatureCount from '@/components/BarChartFeatureCount';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { includes, startCase } from 'lodash';
import { connect } from 'umi';
import axios from 'axios';
import {
  getExternalFeatureConfigBySegment,
  getExternalFeatureCountBySegment,
} from '@/services/configs';
import RadarChartScale from '../RadarChartScale';
import styles from './index.less';
import { TYPE_CHART } from '@/utils/constant';
import HorizontalBarChartFeatureCount from '../HorizontalBarChartFeatureCount';

let typeChart = 7;
const HorizontalFeatureCountChartContainer = ({
  chartScaleData,
  dispatch,
  typeChartScale,
  idScale,
  id,
  chartScaleHistories,
  chartHistories,
  loadingChart,
  config = {},
}) => {
  const numberOfChart = Object.keys(TYPE_CHART).length;
  const [typeDisplay, setTypeDisplay] = useState('top20');
  const [chartDataTopFea, setChartDataTopFea] = useState([]);
  const [dataPaging, setDataPaging] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [paramURL, setParamURL] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const { INTERNAL_CHART, FEATURE_COUNT_BAR_CHART } = TYPE_CHART;

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

  const _renderTitleChart = () => {
    const { isexternalCustomersConfig } = config;

    switch (isexternalCustomersConfig) {
      case true:
        return `${startCase(idChart2)} - Top Feature - Profile Based`;
      case false:
        return `${startCase(idChart2)} - Top Feature - Customer Based`;
      default:
        return `${startCase(idChart2)} - Top Feature - Customer Based`;
    }
  };
  const _renderChart = () => {
    if (chartDataTopFea.length === 0) {
      return <div className={styles.noData}>No data to display</div>;
    }
    return (
      <>
        <div className={styles.chartContainer__title}>{_renderTitleChart()}</div>
        {dataPaging.length > 0 && (
          <HorizontalBarChartFeatureCount
            yLabel={'Feature Sum Number'}
            keyX={'cust_id'}
            setId={setId}
            chartData={typeDisplay === 'all' ? dataPaging : chartDataTopFea.slice(0, 20)}
            typeChart={7}
            // totalConfigs={totalConfigs}
            key={dataPaging.length}
          />
        )}
        {typeDisplay === 'all' && chartDataTopFea.length > 0 && (
          <Pagination
            className={styles.pagination}
            showSizeChanger={false}
            responsive={true}
            total={chartDataTopFea.length}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={perPage}
            defaultCurrent={page}
            // showQuickJumper
            key={page}
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

  if (idChart2.toLowerCase() in SEGMENT_MAP) {
    if (paramURL.custom_segment !== SEGMENT_MAP[idChart2.toLowerCase()]) {
      setParamURL((state) => {
        return { ...state, custom_segment: SEGMENT_MAP[idChart2.toLowerCase()] };
      });
    }
  }

  const handleGetDataChartTopFeature = async () => {
    setLoading(true);
    if (!paramURL.custom_segment) {
      return;
    }
    let handleAPIURL = async () => {};
    const { isexternalCustomersConfig } = config;

    if (!isexternalCustomersConfig) {
      handleAPIURL = getExternalFeatureCountBySegment;
    } else {
      handleAPIURL = getExternalFeatureConfigBySegment;
    }
    const { data } = await handleAPIURL(paramURL);
    let fdata = data['categories'] || {};
    let totalConfigs = [];
    let chart_data = {};
    setCategoriesList(data['CATEGORIES'] || []);

    Object.values(fdata).forEach((element) => {
      totalConfigs.push(...element);
    });

    let feature_set = new Set(totalConfigs);
    let feature_list = [...feature_set];
    feature_list.forEach((feature) => {
      chart_data[feature] = {};
      chart_data[feature]['feature'] = feature;
      chart_data[feature]['sum'] = totalConfigs.filter((x) => x === feature).length;
      chart_data[feature]['percent'] = Math.round(
        (Number(chart_data[feature]['sum']) * 100) / Number(data['count']),
      );
    });

    let fchart_data = Object.values(chart_data)
      .sort((a, b) => b.percent - a.percent)
      .filter((item) => {
        const { feature = '' } = item;
        return feature.includes(category);
      });

    setChartDataTopFea(
      fchart_data.map((i) => {
        return {
          cust_id: i.feature,
          value: i.percent,
        };
      }),
    );

    setDataPaging(
      fchart_data.slice(0, 20).map((i) => {
        return {
          cust_id: i.feature,
          value: i.percent,
        };
      }),
    );
    setLoading(false);
  };

  const handleChangeParamURL = (valueObj) => {
    setParamURL((state) => {
      return { ...state, ...valueObj };
    });
    setPage(1);
  };
  const handleChangeCategory = (value) => {
    setPage(1);
    setCategory(value);
  };
  useEffect(() => handleGetDataChartTopFeature(), [paramURL, category]);
  return (
    <div className={styles.chartContainer}>
      <Row
        justify={typeChart === FEATURE_COUNT_BAR_CHART ? 'space-between' : 'end'}
        className={styles.dropdownLeft}
      >
        {typeChart === FEATURE_COUNT_BAR_CHART && (
          <Select onChange={(e) => setTypeDisplay(e)} defaultValue={typeDisplay}>
            <Select.Option value="top20">Top 20</Select.Option>
            <Select.Option value="all">All</Select.Option>
          </Select>
        )}
      </Row>
      <Row className={styles.dropdownRight}>
        <Select defaultValue={'All'} onChange={(e) => handleChangeParamURL({ sw: e })}>
          <Select.Option value="">All</Select.Option>
          <Select.Option value="92">9200</Select.Option>
          <Select.Option value="93">9300</Select.Option>
          <Select.Option value="94">9400</Select.Option>
          <Select.Option value="95">9500</Select.Option>
          <Select.Option value="96">9600</Select.Option>
        </Select>
      </Row>
      <Row className={styles.dropdownRight} style={{ marginRight: '20px' }}>
        <Select
          defaultValue={'Categories'}
          onChange={handleChangeCategory}
          style={{ width: 120, textTransform: 'capitalize' }}
        >
          <Select.Option key={'all'} value={''}>
            {' '}
            Select All
          </Select.Option>
          ;
          {categoriesList.map((category) => {
            // eslint-disable-next-line react/jsx-key
            return (
              <Select.Option
                key={category.key}
                value={category.key}
                style={{ textTransform: 'capitalize' }}
              >
                {category.value}
              </Select.Option>
            );
          })}
        </Select>
      </Row>
      {loadingChart || loading ? <PageLoading /> : <>{_renderChart()}</>}
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
)(React.memo(HorizontalFeatureCountChartContainer));