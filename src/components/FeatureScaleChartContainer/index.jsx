import BarChartScale from '@/components/BarChartScale';
import { TYPE_CHART } from '@/utils/constant';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import RadarChartScaleAvg from '../RadarChartScaleAvg';
import styles from './index.less';
import {
  getExternalFeatureConfigBySegment,
  getExternalFeatureCountBySegment,
} from '@/services/configs';
import FeatureCountAvgChartContainer from '../FeatureCountAvgChartContainer';
import BarChartItem from '../BarChartFeatureAvg';
import BarChartFeatureCount from '@/components/BarChartFeatureCount';

const FeatureScaleChartContainer = ({
  dispatch,
  typeChartScale,
  id,
  idScale,
  chartHistories,
  loadingChart,
  chartDataScale,
  chartScaleHistories,
  isUploadPage = false,
  externalCustomerId,
  internalCustomerId,
  config = {},
}) => {
  const numberOfChart = 5;
  const { CATEGORY_CHART, FEATURE_CHART, FEATURE_DETAIL_CHART, INTERNAL_CHART } = TYPE_CHART;
  const [chartDataFeaCat, setChartDataFeaCat] = useState([]);
  const [chartDataFeaCount, setChartDataFeaCount] = useState([]);
  const [dataPaging, setDataPaging] = useState([]);
  const [typeChartSwitch, setTypeChart] = useState('feaCat');
  const [typeDisplay, setTypeDisplay] = useState('20');
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [paramURL, setParamURL] = useState({});

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

  const idChart2 = chartHistories.find((item) => item.typeChart === INTERNAL_CHART)?.id;

  console.log(idChart2);

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

  const handlePrevious = () => {
    setTypeChart('feaCat');
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
    const { isexternalCustomersConfig } = config;

    switch (isexternalCustomersConfig) {
      case true:
        return `${startCase(idChart2)} - Top Feature Count - Profile Based`;
      case false:
        return `${startCase(idChart2)} - Top Feature Count - Customer Based`;
      default:
        return `${startCase(idChart2)} - Top Feature Count - Customer Based`;
    }
  };

  const handleChartScaleAvg = (value) => {
    setTypeChart('feaCount');
    const activeLabel = value.activeLabel;
    // setChartDataFeaCount(value.activeLabel)
  };

  const _renderChart = () => {
    if (chartDataFeaCat.length === 0 && typeChartScale !== 4) {
      return <div className={styles.noData}>No data to display</div>;
    }
    console.log(typeChartScale);
    // if (typeChartScale === 2) {
    //   return (
    //     <>
    //       <BarChartScale
    //         yLabel={getYLabelOfChart()}
    //         keyX={keyOfChart()}
    //         setId={setId}
    //         chartScaleData={chartDataFeaCat}
    //         typeChartScale={typeChartScale}
    //         idChart2={internalCustomerId}
    //       />
    //     </>
    //   );
    // }
    return (
      <>
        {typeChartSwitch === 'feaCat' && (
          <RadarChartScaleAvg
            key="feaCat"
            chartScaleData={chartDataFeaCat}
            idChart2={idChart2}
            onClick={handleChartScaleAvg}
          />
        )}
        {/* {typeChartSwitch === 'feaCount' && <BarChartItem yLabel='Feature Count Avg Number' keyX={'cust_id'} key='feaCount' chartData={chartDataFeaCount} idChart2={idChart2} onClick={handleChartScaleAvg} />
        }  */}
        {typeChartSwitch === 'feaCount' && dataPaging.length > 0 && (
          <BarChartItem
            yLabel={'Feature Sum Number'}
            keyX={'cust_id'}
            setId={setId}
            chartData={typeDisplay === 'all' ? dataPaging : chartDataFeaCount.slice(0, 20)}
            typeChart={7}
            // totalConfigs={totalConfigs}
            key={dataPaging.length}
            // domain={getDomain()}
          />
        )}
        {typeChartSwitch === 'feaCount' && typeDisplay === 'all' && chartDataFeaCount.length > 0 && (
          <Pagination
            className={styles.pagination}
            showSizeChanger={false}
            responsive={true}
            total={chartDataFeaCount.length}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={perPage}
            defaultCurrent={page}
            // showQuickJumper
            key={page}
            onChange={(current) => {
              setPage(current);
              setDataPaging(
                chartDataFeaCount.slice((current - 1) * perPage, (current - 1) * perPage + perPage),
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

  const handleGetDataChartFeatureCat = async (e = {}) => {
    if (!paramURL.custom_segment) {
      return;
    }
    const { isexternalCustomersConfig } = config;
    let handleAPIURL = async () => {};
    if (!isexternalCustomersConfig) {
      handleAPIURL = getExternalFeatureCountBySegment;
    } else {
      handleAPIURL = getExternalFeatureConfigBySegment;
    }
    const { data } = await handleAPIURL(paramURL);
    let fdata = data['categories'] || {};
    let chart_data = {};

    let cat_list = Object.keys(fdata);
    console.log('feature_list', cat_list);
    cat_list.forEach((category) => {
      chart_data[category] = {};
      chart_data[category]['category'] = category;
      chart_data[category]['sum'] = fdata[category].length;
    });

    console.log('chart data', chart_data);
    // console.log('total configs: ', totalConfigs)
    // fdata = fdata.sort((a, b) => b.sum - a.sum);
    // console.log("data: ", fdata);
    let fchart_data = Object.values(chart_data);
    setChartDataFeaCat(
      fchart_data.map((i) => {
        return {
          category: i.category,
          value: i.sum,
        };
      }),
    );

    let fcdata = Object.values(data['featureCounts'] ? data['featureCounts'] : {}) || [];
    fcdata = fcdata.sort((a, b) => b.avg - a.avg);
    // console.log("data: ", fdata);
    setChartDataFeaCount(
      fcdata.map((i) => {
        return {
          cust_id: i.feature,
          value_max: i.max,
          value: i.avg,
        };
      }),
    );

    setDataPaging(
      fcdata.slice(0, 20).map((i) => {
        return {
          cust_id: i.feature,
          value_max: i.max,
          value: i.avg,
        };
      }),
    );
  };
  const handleChangeParamURL = (valueObj) => {
    setParamURL((state) => {
      return { ...state, ...valueObj };
    });
    setPage(1);
  };
  useEffect(() => handleGetDataChartFeatureCat(), [paramURL]);

  return (
    <div className={styles.chartContainer}>
      <Row justify="end">
        <div className={styles.chartContainer__actions}>
          <span
            onClick={() => handlePrevious()}
            className={typeChartSwitch === 'feaCat' && styles.chartContainer__actions__disabled}
          >
            Previous
          </span>
        </div>
      </Row>
      <Row className={styles.dropdownLeft}>
        {typeChartSwitch !== 'feaCat' && (
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
      internalCustomerId = null,
      externalCustomerId = null,
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
)(React.memo(FeatureScaleChartContainer));
