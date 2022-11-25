import BarChartFeatureCount from '@/components/BarChartFeatureCount';
import { PageLoading } from '@ant-design/pro-layout';
import { Pagination, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { includes, startCase } from 'lodash';
import { connect } from 'umi';
import axios from 'axios';
import { handleGetDataGlobalFeature25 } from '@/services/configs';
import styles from './index.less';
import HorizontalBarChartFeatureCount from '../HorizontalBarChartFeatureCount';
import { Label } from 'recharts';

const FeatureCountChartContainer = () => {
  const [typeDisplay, setTypeDisplay] = useState('top20');
  const [chartDataTopFea, setChartDataTopFea] = useState([]);
  const [dataPaging, setDataPaging] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [platformList, setPlatformList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState({});
  const [listIgnoreFeatures, setListIgnoreFeatures] = useState([]);

  const [sw, setSw] = useState('');
  const [listGlobalTopFeature25, setListGlobalTopFeature25] = useState({});
  const [isloadingChart, setisLoadingChart] = useState(true);

  const _renderChart = () => {
    if (chartDataTopFea.length === 0) {
      return <div className={styles.noData}>No data to display</div>;
    }
    return (
      <>
        <div className={styles.chartContainer__title}>{`Top Features`}</div>
        {dataPaging.length > 0 && (
          <HorizontalBarChartFeatureCount
            yLabel={'Percentage Number'}
            keyX={'cust_id'}
            chartData={typeDisplay === 'all' ? dataPaging : chartDataTopFea.slice(0, 20)}
            typeChart={7}
            // totalConfigs={totalConfigs}
            key={dataPaging.length}
            // domain={getDomain()}
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
            current={page}
            // key={page}
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
    if (!data) {
      return;
    }
    setSw(data['platformList'][0]);
    setPlatformList(data['platformList']);
    setCategoriesList(data['CATEGORIES']);
    setListIgnoreFeatures(data['listIgnoreFeatures']);
    setisLoadingChart(false);
  };

  const handleChangeSW = (value) => {
    setPage(1);
    setSw(value);
  };
  const handleChangeCategory = (props) => {
    try {
      let categoryConvert = { key: '', value: '' };
      if (props) {
        categoryConvert = JSON.parse(props);
      }
      setPage(1);
      setCategory(categoryConvert);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sw || !listGlobalTopFeature25.features) {
      return;
    }
    let fdata = listGlobalTopFeature25['features'][sw] || {};
    const ignoreFeatures = listIgnoreFeatures.find(
      (item) => item.area.toUpperCase() === category.value.toUpperCase(),
    );
    const fdataArr = Object.keys(fdata)
      .sort((a, b) => {
        return fdata[b] - fdata[a];
      })
      .filter((item) => {
        const isCategory = item.includes(category.key || '');
        let isIgnore = false;
        if (ignoreFeatures) {
          isIgnore = ignoreFeatures.feature_list.includes(item);
        }
        return isCategory && !isIgnore;
      });
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
  }, [sw, listGlobalTopFeature25, category]);

  useEffect(() => handleGetDataChartTopFeature(), []);
  return (
    <div className={styles.chartContainer}>
      <Row justify={'space-between'} className={styles.dropdownLeft}>
        <Select onChange={(e) => setTypeDisplay(e)} defaultValue={typeDisplay}>
          <Select.Option value="top20">Top 20</Select.Option>
          <Select.Option value="all">Show All</Select.Option>
        </Select>
      </Row>
      <Row className={styles.dropdownRight}>
        <Select defaultValue={'Platforms'} onChange={(e) => handleChangeSW(e)}>
          {platformList.map((platform) => {
            // eslint-disable-next-line react/jsx-key
            return (
              <Select.Option key={platform} value={platform}>
                {platform}
              </Select.Option>
            );
          })}
        </Select>
      </Row>
      <Row className={styles.dropdownRight}>
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
                value={JSON.stringify(category)}
                style={{ textTransform: 'capitalize' }}
              >
                {category.value}
              </Select.Option>
            );
          })}
        </Select>
      </Row>
      {isloadingChart && <PageLoading />}
      {!isloadingChart && _renderChart()}
    </div>
  );
};

export default React.memo(FeatureCountChartContainer);
