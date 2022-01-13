import PageLoading from '@/components/PageLoading';
import React from 'react';
import { startCase } from 'lodash';

export const COVERED = 'COVERED';
export const NOT_COVERED = 'NOT_COVERED';
export const COVERED_BY_COMBINATION = 'COVERED_BY_COMBINATION';

const ScaleSearch = ({ searchDetail = {} }) => {
  const { result = {} } = searchDetail;
  const {
    totalExternalCustomer,
    externalCustomerConditionSatisfy,
    dataCombine,
    conditions = [],
  } = result;
  // const percent =0
  const percent = Number(
    parseFloat((externalCustomerConditionSatisfy / totalExternalCustomer) * 100).toFixed(2),
  );

  const _renderContent = () => {
    if (dataCombine?.type === NOT_COVERED) {
      return null;
    }
    return `Both ${dataCombine?.data
      .map((i) => startCase(i))
      .join(' and ')} covered  the conditions for this scale search`;
  };
  if (externalCustomerConditionSatisfy === undefined) {
    return <PageLoading />;
  }

  return (
    <div className="card">
      <h2>
        <strong>{`${conditions
          .map(({ name = '', value = 0, operator = '' }) => `${name} ${operator} ${value}`)
          .join(' and ')}`}</strong>
      </h2>
      <div style={{ margin: '20px 0 5px' }}>
        {`
          ${externalCustomerConditionSatisfy}/${totalExternalCustomer} (${percent}%)
          external customers has satisfy the conditions for this scale search
        `}
      </div>
      <div>{_renderContent()}</div>
    </div>
  );
};

export default ScaleSearch;
