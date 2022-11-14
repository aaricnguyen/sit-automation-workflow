import BarChartScale from '@/components/BarChartScale';
import { TYPE_CHART } from '@/utils/constant';
import { PageLoading } from '@ant-design/pro-layout';
import { Row } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import RadarChartScaleAvg from '../RadarChartScaleAvg';
import styles from './index.less';
import { getExternalFeatureCountBySegment } from '@/services/configs';

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
}) => {
  const numberOfChart = 5;
  const { CATEGORY_CHART, FEATURE_CHART, FEATURE_DETAIL_CHART, INTERNAL_CHART } = TYPE_CHART;
  const [chartDataFeaCat, setChartDataFeaCat] = useState([]);
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
      <RadarChartScaleAvg
        setId={setId}
        keyX={keyOfChart()}
        idChart3={idChart2}
        idChart2={internalCustomerId}
        chartScaleData={chartDataFeaCat}
      />
    );
  };

  let cust_segment = undefined;

  if (idChart2.toLowerCase() in SEGMENT_MAP) {
    cust_segment = SEGMENT_MAP[idChart2.toLowerCase()];
  }

  const handleGetDataChartFeatureCat = async () => {
    if (cust_segment === undefined) {
      return;
    }
    const { data } = await getExternalFeatureCountBySegment({ cust_segment: cust_segment });
    let fdata = data['categories'];
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
  };

  useEffect(() => handleGetDataChartFeatureCat(), []);

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
          <div className={styles.chartContainer__title}>{`${startCase(
            idChart2,
          )} - Category Chart`}</div>
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
