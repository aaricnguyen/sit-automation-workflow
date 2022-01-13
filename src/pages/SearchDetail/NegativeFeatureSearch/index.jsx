import PageLoading from '@/components/PageLoading';
import React from 'react';

export const COVERED = 'COVERED';
export const NOT_COVERED = 'NOT_COVERED';
export const COVERED_BY_COMBINATION = 'COVERED_BY_COMBINATION';

const NegativeFeatureSearch = ({ searchDetail = {} }) => {
  const { result = {} } = searchDetail;
  const {
    totalExternalCustomer,
    totalExternalCustomerNotHasFeatures,
    dataCombine,
    totalConfig = [],
  } = result;

  const percent = Number(
    parseFloat((totalExternalCustomerNotHasFeatures / totalExternalCustomer) * 100).toFixed(2),
  );

  const _renderContent = () => {
    if (dataCombine?.type === NOT_COVERED) {
      return null;
    }
    return `Both ${dataCombine?.data.join(' and ')} covered ${totalConfig.join(', ')}`;
  };
  if (totalExternalCustomerNotHasFeatures === undefined) {
    return <PageLoading />;
  }

  return (
    <div className="card">
      <h2>
        <strong>{totalConfig.join(' and ')}</strong>
      </h2>
      <div style={{ margin: '20px 0 5px' }}>
        {`
        ${totalConfig.join(
          ', ',
        )} are absent in ${totalExternalCustomerNotHasFeatures}/${totalExternalCustomer} (${percent}%) of external customers
        `}
      </div>
      <div>{_renderContent()}</div>
    </div>
  );
};

export default NegativeFeatureSearch;
