import ChartContainer from '@/components/ChartContainer';
import OverviewList from '@/components/OverviewList';
import InsightList from '@/components/InsightList';
import PageLoading from '@/components/PageLoading';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const Dashboard = ({ loading, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'dashboard/updateData',
      payload: {
        percent: 90,
      },
    });
  }, []);
  return (
    <PageContainer>
      <div className={styles.dashboardContainer}>
        {loading ? (
          <PageLoading />
        ) : (
          <>
            <OverviewList />
            <div className={styles.mainContentWrapper}>
              <ChartContainer />
              <InsightList />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['dashboard/updateData'],
}))(Dashboard);
