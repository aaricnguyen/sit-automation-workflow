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
  handleGetDataGlobalFeature25,
} from '@/services/configs';
import styles from './index.less';
import { TYPE_CHART } from '@/utils/constant';

let typeChart = 7;
const FeatureCountChartContainer = ({ config = {} }) => {
  const [typeDisplay, setTypeDisplay] = useState('top20');
  const [chartDataTopFea, setChartDataTopFea] = useState([]);
  const [dataPaging, setDataPaging] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [platformList, setPlatformList] = useState([]);
  const [sw, setSw] = useState('');
  const [listGlobalTopFeature25, setListGlobalTopFeature25] = useState({});
  const [isloadingChart, setisLoadingChart] = useState(true);

  const {
    // SIT_PROFILE_COMPARE,
    INTERNAL_CHART,
    CATEGORY_CHART,
    FEATURE_CHART,
    FEATURE_DETAIL_CHART,
    FEATURE_COUNT_BAR_CHART,
  } = TYPE_CHART;

  const _renderChart = () => {
    if (chartDataTopFea.length === 0) {
      return <div className={styles.noData}>No data to display</div>;
    }
    return (
      <>
        <div className={styles.chartContainer__title}>{`Top Features`}</div>
        {dataPaging.length > 0 && (
          <BarChartFeatureCount
            yLabel={'Percentage Number'}
            keyX={'cust_id'}
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

  const handleGetDataChartTopFeature = async () => {
    const { data } = await handleGetDataGlobalFeature25();
    setListGlobalTopFeature25(data);
    console.log(data);
    setSw(data['platformList'][0]);
    setPlatformList(data['platformList']);
    setisLoadingChart(false);
  };

  const handleSetSW = (value) => {
    setSw(value);
  };

  useEffect(() => {
    if (!sw || !listGlobalTopFeature25.features) {
      return;
    }
    let fdata = listGlobalTopFeature25['features'][sw] || {};
    const fdataArr = Object.keys(fdata).sort((a, b) => {
      return fdata[b] - fdata[a];
    });
    const test = fdataArr.map((i) => {
      return {
        cust_id: i,
        value: fdata[i],
      };
    });
    // console.log('test', test);
    setChartDataTopFea(
      fdataArr.map((i) => {
        return {
          cust_id: i,
          value: fdata[i],
        };
      }),
    );

    setDataPaging(
      fdataArr.slice(0, 20).map((i) => {
        return {
          cust_id: i,
          value: fdata[i],
        };
      }),
    );
  }, [sw, listGlobalTopFeature25]);
  useEffect(() => handleGetDataChartTopFeature(), []);

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
        <Select defaultValue={'All'} onChange={(e) => handleSetSW(e)}>
          {platformList.map((platform) => {
            // eslint-disable-next-line react/jsx-key
            return <Select.Option value={platform}>{platform}</Select.Option>;
          })}
        </Select>
      </Row>
      {isloadingChart && <PageLoading />}
      {!isloadingChart && _renderChart()}
    </div>
  );
};

export default React.memo(FeatureCountChartContainer);
