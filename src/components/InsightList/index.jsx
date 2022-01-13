import React, { useEffect } from 'react';
import styles from './index.less';
import { connect } from 'umi';

const InsightList = (props) => {
  const { insightList, dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'insight/getInsightList',
    });
  }, []);
  return (
    <div className={`card ${styles.insightList}`}>
      <div className={styles.insightList__header}>Insight List</div>
      <div className={styles.insightList__container}>
        {insightList.map((insight, key) => (
          <div className={styles.insightList__container__item} key={key}>
            {insight.resultTemplate}
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(({ insight: { insightList = [] } }) => ({
  insightList,
}))(React.memo(InsightList));
