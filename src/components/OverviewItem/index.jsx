import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

export default function OverviewItem({ onClick, value = 0, title = '', Icon = <></> }) {
  return (
    <div className={styles.overview}>
      <img className={styles.overview__icon} src={Icon} alt="icon overview" />
      <div>
        <div className={styles.overview__title}>{title}</div>
        <div className={styles.overview__value}>{value}</div>
      </div>

      {onClick && (
        <Button onClick={() => onClick()} type="link">
          update data
        </Button>
      )}
    </div>
  );
}
