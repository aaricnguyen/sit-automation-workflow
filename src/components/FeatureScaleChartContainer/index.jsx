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
import BarChartFeatureCount from '@/components/BarChartFeatureCount';
import BarChartScaleItem from '@/components/BarChartScale';

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
  const [typeChartSwitch, setTypeChart] = useState('feaCat');
  const [typeDisplay, setTypeDisplay] = useState('20');
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [paramURL, setParamURL] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);

  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
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

  const _renderTitleChart = (total) => {
    const { isexternalCustomersConfig } = config;

    switch (isexternalCustomersConfig) {
      case true:
        return `Top Feature Count \n[Based on ${total} ${startCase(idChart2)} Config files]`;
      case false:
        return `${startCase(idChart2)} - Top Feature Count - Customer Based`;
      default:
        return `${startCase(idChart2)} - Top Feature Count - Customer Based`;
    }
  };

  const handleChartScaleAvg = (value) => {
    setTypeChart('feaCount');
    // const activeLabel = value.activeLabel;
    // setChartDataFeaCount(value.activeLabel)
  };

  const _renderChart = () => {
    if (chartDataFeaCat.length === 0 && typeChartScale !== 4) {
      return <div className={styles.noData}>No data to display</div>;
    }
    const categoryFilter = categoriesList.find((item) => item.scaleFeatureType === category) || {};
    const templateFilterCount = categoryFilter.scaleFeatures;
    let max = 0;
    const chartDataFeaCountFilter = chartDataFeaCount.filter((item) => {
      if (max < Number(item.value_max)) {
        max = Number(item.value_max);
      }
      if (templateFilterCount === undefined) {
        //Select All, templateFilterCount is undefined, do not filter
        return true;
      }
      const { cust_id = '' } = item;
      return templateFilterCount.includes(cust_id);
    });
    const lengthMax = max.toString().length;
    max = Math.ceil(max / Math.pow(10, lengthMax - 1)) * Math.pow(10, lengthMax - 1);
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
        {typeChartSwitch === 'feaCount' && chartDataFeaCountFilter.length > 0 && (
          <BarChartScaleItem
            yLabel={'Feature Count'}
            keyX={'cust_id'}
            key1="value"
            key2="value_max"
            name1="Avg Count"
            name2="Max Count"
            setId={setId}
            chartScaleData={chartDataFeaCountFilter.filter((item, index) => {
              const min = (page - 1) * perPage;
              const max = min + perPage;
              if (index >= min && index < max) {
                return true;
              }
            })}
            typeChart={7}
            // totalConfigs={totalConfigs}
            key={chartDataFeaCountFilter.length}
            barSize={20}
            maxBarSize={20}
            domain={[0, max]}
          />
        )}
        {typeChartSwitch === 'feaCount' &&
          typeDisplay === 'all' &&
          chartDataFeaCountFilter.length > 0 && (
            <Pagination
              className={styles.pagination}
              showSizeChanger={false}
              responsive={true}
              total={chartDataFeaCountFilter.length}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              defaultPageSize={perPage}
              defaultCurrent={page}
              // showQuickJumper
              key={page}
              onChange={(current) => {
                setPage(current);
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
    setLoading(true);
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
    setCategoriesList(data['categoriesScale'] || []);

    let cat_list = Object.keys(fdata);
    cat_list.forEach((category) => {
      chart_data[category] = {};
      chart_data[category]['category'] = category;
      chart_data[category]['sum'] = fdata[category].length;
    });
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
    fcdata = fcdata.sort((a, b) => b.max - a.max);
    setChartDataFeaCount(
      fcdata.map((i) => {
        return {
          cust_id: i.feature,
          value_max: i.max,
          value: i.avg,
          total: i.total,
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
          <Select
            onChange={(e) => {
              setTypeDisplay(e);
              setPage(1);
            }}
            defaultValue={typeDisplay}
          >
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
      {typeChartSwitch !== 'feaCat' && (
        <Row className={styles.dropdownRight} style={{ marginRight: '20px' }}>
          <Select
            defaultValue={'Categories'}
            onChange={handleChangeCategory}
            style={{ width: 120, textTransform: 'capitalize' }}
          >
            <Select.Option key={'all'} value={''}>
              Select All
            </Select.Option>
            {categoriesList.map((category) => {
              // eslint-disable-next-line react/jsx-key
              return (
                <Select.Option
                  key={category.scaleFeatureType}
                  value={category.scaleFeatureType}
                  style={{ textTransform: 'capitalize' }}
                >
                  {category.scaleFeatureType}
                </Select.Option>
              );
            })}
          </Select>
        </Row>
      )}
      {loadingChart || loading ? (
        <PageLoading />
      ) : (
        <>
          <div className={styles.chartContainer__title}>
            {_renderTitleChart(chartDataFeaCount[0] ? chartDataFeaCount[0].total : 0)}
          </div>
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
