import { Modal } from 'antd';
import { startCase } from 'lodash-es';
import React, { useState } from 'react';
import { connect } from 'umi';
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

const SummaryInfo = ({
  totalConfig,
  externalCustomerId,
  dataCombine,
  isUploadPage = false,
  showChart,
  dataUniq,
  setShowChart = () => {},
  internalCustomerId,
  dispatch,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data = [], type = '' } = dataCombine;
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderContent = (dataFile) => {
    if (!dataFile) return;
    const newData = dataFile.split('\n');
    const result = [];
    newData.forEach((item) => {
      if (item.startsWith('!')) {
        result.push(item);
      } else {
        result.push(`<mark>${item}</mark>`);
      }
    });
    // eslint-disable-next-line consistent-return
    return result.join('\n');
  };

  const handleShowChart = () => {
    if (showChart === false) {
      setShowChart(true);
    } else {
      dispatch({
        type: 'config/save',
        payload: {
          id: internalCustomerId,
          chartHistories: [{ typeChart: 3, id: internalCustomerId }],
          typeChart: 3,
        },
      });
    }
  };
  return (
    <div className={`card`}>
      {isUploadPage && (
        <div className={style.title}>
          New customer {externalCustomerId} is uploaded with {totalConfig.length} features enabled
          which are covered {data?.[0]?.value}% by{' '}
          <a onClick={() => handleShowChart()}> {startCase(data?.[0]?.cust_id)}</a>
        </div>
      )}
      {!isUploadPage && (
        <div className={style.title}>
          Customer {externalCustomerId} has {totalConfig.length} features enabled which are covered{' '}
          {data?.[0]?.value}% by{' '}
          <a onClick={() => handleShowChart()}> {startCase(data?.[0]?.cust_id)}</a>
        </div>
      )}
      <p style={{ overflowWrap: 'break-word' }}>{totalConfig.join(', ')}</p>

      {data.length > 0 && (
        <>
          <div className={style.title}>{_renderTitle(type, externalCustomerId)}</div>
          <p style={{ overflowWrap: 'break-word' }}>
            {data
              .map((item) => {
                return type === NOT_COVERED ? item : `${startCase(item.cust_id)} (${item.value} %)`;
              })
              .join(', ')}
          </p>
        </>
      )}
      {dataUniq && dataUniq.length > 0 && (
        <div className={style.title}>
          Unparsed Configuration: <a onClick={showModal}>Link</a>
        </div>
      )}
      <Modal
        title={`Unparsed Configuration: ${externalCustomerId}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className={style.modal}
        bodyStyle={{ maxHeight: '500px', overflowY: 'scroll' }}
      >
        {/* {renderContent(dataUniq?.[0]?.dataFile)} */}
        <div dangerouslySetInnerHTML={{ __html: renderContent(dataUniq?.[0]?.dataFile) }} />
      </Modal>
    </div>
  );
};

// export default SummaryInfo;

export default connect(({ config: { internalCustomerId } }) => ({
  internalCustomerId,
}))(SummaryInfo);
