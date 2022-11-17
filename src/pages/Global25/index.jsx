import PageLoading from '@/components/PageLoading';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import FeatureCountChartContainerV2 from '@/components/FeatureCountChartContainerV2';

const Global25 = () => {
  return (
    <PageContainer>
      <div className={styles.dashboardContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.ChartContainer}>
            <FeatureCountChartContainerV2
              config={{
                isexternalCustomersConfig: true,
              }}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Global25;
