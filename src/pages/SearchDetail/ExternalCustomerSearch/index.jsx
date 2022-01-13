import PageLoading from '@/components/PageLoading';
import SummaryInfo from '@/components/SummaryInfo';
import UploadChartContainer from '@/components/UploadChartContainer';
import { initialState } from '@/models/config';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import styles from './index.less';

const ExternalCustomerSearch = (props) => {
  const { loading, searchDetail, dispatch } = props;
  const { data: externalCustomerId, result: { totalConfig = [], dataCombine = [] } = {} } =
    searchDetail;
  const {
    location: {
      query: { data = '' },
    },
  } = history;

  useEffect(() => {
    dispatch({
      type: 'config/save',
      payload: { externalCustomerId: JSON.parse(data) },
    });
    return () => {
      dispatch({
        type: 'config/save',
        payload: initialState,
      });
    };
  }, []);

  if (loading || !externalCustomerId) {
    return <PageLoading />;
  }
  return (
    <PageContainer>
      <div className={styles.searchPage}>
        <div className={`${styles.searchPage__summaryInfo}`} style={{ marginTop: '20px' }}>
          <SummaryInfo
            externalCustomerId={externalCustomerId}
            dataCombine={dataCombine}
            totalConfig={totalConfig}
          />

          {!loading && externalCustomerId && (
            <div style={{ marginTop: '20px' }}>
              <UploadChartContainer />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default connect(
  ({
    loading,
    config: {
      externalCustomerId = '',
      chartData = [],
      totalConfig = [],
      dataCombine = {},
      dataSearch = [],
    },
  }) => ({
    loading: loading.effects['config/search'],
    externalCustomerId,
    chartData,
    totalConfig,
    dataCombine,
    dataSearch,
  }),
)(React.memo(ExternalCustomerSearch));
