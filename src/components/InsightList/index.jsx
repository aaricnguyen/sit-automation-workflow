import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const InsightList = (props) => {
  const { insightList, dispatch, chartId } = props;
  const insightListRef = useRef(null);
  const [insight, setInsight] = useState(insightList);
  useEffect(() => {
    dispatch({
      type: 'insight/getInsightList',
    });
  }, []);

  useEffect(() => {
    if (chartId !== 'all') {
      setInsight(insightList.filter((item) => item.key.includes(chartId)));
    } else {
      setInsight(insightList);
    }
  }, [chartId, insightList]);

  const pageScroll = () => {
    if (insightListRef.current === null) return;
    let count = 0;
    if (count < 2) {
      const objDiv = insightListRef.current;
      objDiv.scrollTop += 1;
      if (objDiv.scrollTop === objDiv.scrollHeight - 61) {
        setTimeout(() => {
          objDiv.scrollTop = 0;
          count += 1;
        }, 1200);
      }

      setTimeout(pageScroll, 50);
      if (objDiv.scrollTop + objDiv.clientHeight === objDiv.scrollHeight) {
        objDiv.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    setTimeout(pageScroll, 1000);
  }, []);

  return (
    <div className={`card ${styles.insightList}`}>
      <div className={styles.insightList__header}>Insight List</div>
      <div ref={insightListRef} className={styles.insightList__container}>
        {insight.map((insight, key) => (
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
