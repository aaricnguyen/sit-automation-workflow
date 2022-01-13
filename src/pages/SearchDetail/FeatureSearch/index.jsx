import PageLoading from '@/components/PageLoading';
import React from 'react';

export const COVERED = 'COVERED';
export const NOT_COVERED = 'NOT_COVERED';
export const COVERED_BY_COMBINATION = 'COVERED_BY_COMBINATION';

const FeatureSearch = ({ searchDetail = {} }) => {
  const { result = {} } = searchDetail;
  const {
    totalExternalCustomer,
    totalExternalCustomerHasFeatures,
    dataCombine,
    totalConfig = [],
  } = result;

  const percent = Number(
    parseFloat((totalExternalCustomerHasFeatures / totalExternalCustomer) * 100).toFixed(2),
  );

  const _renderContent = () => {
    if (dataCombine?.type === NOT_COVERED) {
      return null;
    }
    return `Both ${dataCombine?.data.join(' and ')} covered ${totalConfig.join(', ')}`;
  };
  if (totalExternalCustomerHasFeatures === undefined) {
    return <PageLoading />;
  }

  return (
    <div className="card">
      <h2>
        <strong>{totalConfig.join(' and ')}</strong>
      </h2>
      <div style={{ margin: '20px 0 5px' }}>
        {`
          ${totalExternalCustomerHasFeatures}/${totalExternalCustomer} (${percent}%)
          external customers has ${totalConfig.join(', ')}
        `}
      </div>
      <div>{_renderContent()}</div>
    </div>
  );
};

export default FeatureSearch;
