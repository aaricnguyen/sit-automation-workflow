import { startCase } from 'lodash-es';
import React from 'react';
import style from './index.less';

export const COVERED = 'COVERED';
export const NOT_COVERED = 'NOT_COVERED';
export const COVERED_BY_COMBINATION = 'COVERED_BY_COMBINATION';

const _renderTitle = (type, externalCustomerId) => {
  switch (type) {
    case NOT_COVERED:
      return `Following features of customer ${externalCustomerId} are not covered by any Internal Customers:`;
    case COVERED:
      return `100 % features of customer ${externalCustomerId} are covered by:`;
    default:
      return `100 % features of customer ${externalCustomerId} are covered by the combination of:`;
  }
};

const SummaryInfo = ({ totalConfig, externalCustomerId, dataCombine, isUploadPage = false }) => {
  const { data = [], type = '' } = dataCombine;

  return (
    <div className={`card`}>
      {isUploadPage && (
        <div className={style.title}>
          New customer {externalCustomerId} is uploaded with {totalConfig.length} features enabled
        </div>
      )}
      {!isUploadPage && (
        <div className={style.title}>
          Customer {externalCustomerId} has {totalConfig.length} features enabled
        </div>
      )}
      <p style={{ overflowWrap: 'break-word' }}>{totalConfig.join(', ')}</p>

      {data.length > 0 && (
        <>
          <div className={style.title}>{_renderTitle(type, externalCustomerId)}</div>
          <p style={{ overflowWrap: 'break-word' }}>
            {data
              .map((item) => {
                return `${type === NOT_COVERED ? item : startCase(item)}`;
              })
              .join(', ')}
          </p>
        </>
      )}
    </div>
  );
};

export default SummaryInfo;
