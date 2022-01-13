import ChartContainer from '@/components/ChartContainer';
import PageLoading from '@/components/PageLoading';
import { defaultState } from '@/models/dashboard';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import styles from './index.less';
import InternalInfo from './components/InternalInfo';

const ExternalCustomerSearch = (props) => {
  const { loading, searchDetail, dispatch } = props;
  const {
    data: internalCustomerId,
    result: { totalConfig = [], totalExternalCustomerMatch = 0 } = {},
  } = searchDetail;
  const {
    location: {
      query: { data = '' },
    },
  } = history;
  useEffect(() => {
    dispatch({
      type: 'dashboard/save',
      payload: {
        id: internalCustomerId,
        typeChart: 2,
        chartHistories: [{ typeChart: 2, id: 'education' }],
      },
    });
    return () => {
      dispatch({
        type: 'dashboard/save',
        payload: defaultState,
      });
    };
  }, []);

  if (loading || !internalCustomerId) {
    return <PageLoading />;
  }
  return (
    <PageContainer>
      <div className={styles.searchPage}>
        <div className={`${styles.searchPage__summaryInfo}`} style={{ marginTop: '20px' }}>
          <InternalInfo
            internalCustomerId={internalCustomerId}
            totalConfig={totalConfig}
            totalExternalCustomerMatch={totalExternalCustomerMatch}
          />

          {!loading && internalCustomerId && (
            <div style={{ marginTop: '20px' }}>
              <ChartContainer />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['config/search'],
}))(React.memo(ExternalCustomerSearch));
