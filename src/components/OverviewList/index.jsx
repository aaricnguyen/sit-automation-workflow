import CEdgeIcon from '@/assets/icons/cEdge.svg';
import FunctionalTBIcon from '@/assets/icons/functional_tb.svg';
import SystemTbIcon from '@/assets/icons/system_tb.svg';
import OverviewItem from '@/components/OverviewItem';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const OverviewList = ({ overviewList, dispatch }) => {
  const updateData = () => {
    dispatch({
      type: 'dashboard/updateData',
      payload: {
        percent: 90,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'dashboard/getOverviewList',
      payload: {
        percent: 90,
      },
    });
  }, []);
  return (
    <div className={styles.overviewList}>
      <OverviewItem
        Icon={CEdgeIcon}
        value={overviewList.totalRecords}
        title={'Total Config Files'}
        onClick={updateData}
      />
      <OverviewItem
        Icon={FunctionalTBIcon}
        value={overviewList.externalRecords}
        title={'Total External Customers'}
      />
      <OverviewItem
        Icon={SystemTbIcon}
        value={overviewList.internalRecords}
        title={'Total Internal SIT profiles'}
      />
    </div>
  );
};

export default connect(({ dashboard: { overviewList = [] } }) => ({
  overviewList,
}))(React.memo(OverviewList));
