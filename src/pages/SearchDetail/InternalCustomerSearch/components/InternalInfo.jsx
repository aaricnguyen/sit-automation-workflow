import React from 'react';
import { startCase } from 'lodash';
import style from './index.less';

const InternalInfo = ({
  internalCustomerId = '',
  totalConfig = [],
  totalExternalCustomerMatch = 0,
}) => {
  return (
    <div className="card">
      <p className={style.title}>Internal Customer: {startCase(internalCustomerId)}</p>
      <p>Number of external customers matched: {totalExternalCustomerMatch}</p>
      <p>Number of features enabled: {totalConfig.length}</p>
    </div>
  );
};

export default InternalInfo;
