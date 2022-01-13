import React from 'react';
import { startCase } from 'lodash';

const FeatureAndCustomerCombination = ({ searchDetail = {} }) => {
  const { result = {} } = searchDetail;
  const { customer = '', features = [], isCovered = false } = result;

  return (
    <div className="card">
      <h2>
        <strong>{`Customer: ${startCase(customer)} + features: ${features.join(' and ')}`}</strong>
      </h2>
      <div style={{ margin: '20px 0 5px' }}>
        {`This ${features.length === 1 ? 'feature' : 'combination'} is ${
          isCovered ? '' : 'not'
        } covered in the customer ${startCase(customer)}`}
      </div>
    </div>
  );
};

export default FeatureAndCustomerCombination;
