import ChartContainer from '@/components/ChartContainer';
import ScaleChartContainer from '@/components/ScaleChartContainer';
import FeatureChartContainer from '@/components/FeatureChartContainer';
import FeatureCountChartContainer from '@/components/FeatureCountChartContainer';
import FeatureScaleChartContainer from '@/components/FeatureScaleChartContainer';
import OverviewList from '@/components/OverviewList';
import InsightList from '@/components/InsightList';
import PageLoading from '@/components/PageLoading';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const Dashboard = ({ loading, dispatch, typeChart, id, chartHistories }) => {
  const [chartId, setChartId] = useState('all');

  useEffect(() => {
    dispatch({
      type: 'dashboard/updateData',
      payload: {
        percent: 90,
      },
    });
  }, []);

  useEffect(() => {
    if (typeChart === 2) {
      setChartId(id);
    } else if (typeChart === 1) {
      setChartId('all');
    }
  }, [id, typeChart]);
  return (
    <PageContainer>
      <div className={styles.dashboardContainer}>
        {loading ? (
          <PageLoading />
        ) : (
          <>
            <OverviewList />
            <div className={styles.mainContentWrapper}>
              <div className={styles.ChartContainer}>
                <ChartContainer />
                {/* {typeChart === 2 && <FeatureChartContainer />} */}
                {typeChart === 2 && <FeatureCountChartContainer />}
                {typeChart === 2 && <FeatureScaleChartContainer />}
                {typeChart === 2 && (
                  <FeatureScaleChartContainer
                    config={{
                      isexternalCustomersConfig: true,
                    }}
                  />
                )}
                {typeChart === 2 && (
                  <FeatureCountChartContainer
                    config={{
                      isexternalCustomersConfig: true,
                    }}
                  />
                )}

                {typeChart >= 3 && <ScaleChartContainer />}
              </div>

              <InsightList chartId={chartId} />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default connect(
  ({ dashboard: { chartData = [], chartHistories = [], typeChart = 1, id = '' }, loading }) => ({
    chartData,
    typeChart,
    id,
    chartHistories,
    loading: loading.effects['dashboard/updateData'],
  }),
)(Dashboard);
