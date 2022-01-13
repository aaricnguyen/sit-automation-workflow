import PageLoading from '@/components/PageLoading';
import React from 'react';

export const COVERED = 'COVERED';
export const NOT_COVERED = 'NOT_COVERED';
export const COVERED_BY_COMBINATION = 'COVERED_BY_COMBINATION';

const XorFeatureSearch = ({ searchDetail = {} }) => {
  const { result = {} } = searchDetail;
  const {
    totalExternalCustomer,
    externalCustomerHasFeatures = [],
    dataCombine,
    totalConfig = [],
  } = result;

  const _renderFeatureInfo = ({ feature = '', value = 0 }) => {
    const percent = Number(parseFloat((value / totalExternalCustomer) * 100).toFixed(2));
    return (
      <div>
        {`
    ${value}/${totalExternalCustomer} (${percent}%)
    external customers has ${feature}
  `}
      </div>
    );
  };

  const _renderContent = () => {
    if (dataCombine?.type === NOT_COVERED) {
      return null;
    }
    return `Both ${dataCombine?.data.join(' and ')} covered ${totalConfig.join(', ')}`;
  };
  if (externalCustomerHasFeatures === undefined) {
    return <PageLoading />;
  }

  return (
    <div className="card">
      <h2>
        <strong>{totalConfig.join(' xor ')}</strong>
      </h2>
      <div style={{ margin: '20px 0 5px' }}>
        {externalCustomerHasFeatures.map((item) => _renderFeatureInfo(item))}
      </div>
      <div>{_renderContent()}</div>
    </div>
  );
};

export default XorFeatureSearch;
