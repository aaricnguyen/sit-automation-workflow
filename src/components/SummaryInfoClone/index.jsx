import { Modal } from 'antd';
import { startCase } from 'lodash-es';
import React, { useState } from 'react';
import { connect } from 'umi';
import style from './index.less';

import { getAuthority } from '@/utils/authority';

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

const AutomationWorkflow = ({
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
  const [role, setRole] = useState(false);
  const [routeCmd, setRouteCmd] = useState({});

  const data_table = [
    {
      run_id: '5020',
      status: 'In Progress',
      result_log: 'Test Execution is in Progress',
      health_score: 0,
    },
    {
      run_id: '5020',
      status: 'In Progress',
      result_log: 'Test Execution is in Progress',
      health_score: 0,
    },
    {
      run_id: '5020',
      status: 'In Progress',
      result_log: 'Test Execution is in Progress',
      health_score: 0,
    },
    {
      run_id: '5020',
      status: 'In Progress',
      result_log:
        'https://earms-trade.cisco.com/tradeui/logs/details?ats=%2Fauto%2Ficonatest-bgl%2Fproduction%2Fhcl%2Fpyats3.6&client=web&host=bgl-ads-2455&archive=%2Fauto%2Ficonatest-bgl%2Fproduction%2Fhcl%2Fpyats3.6%2Fusers%2Fsuveerai%2Farchive%2F22-10%2Fcat9kv_hackathon_job.2022Oct06_12:05:58.794837.zip',
      health_score: 10,
    },
  ];

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

  const handleCheckHealthScore = async () => {
    setRouteCmd({
      features: totalConfig,
    });
    /* Mở comment khi API đã xong */
    let parserRoute = new Blob([JSON.stringify(routeCmd)], {
      type: 'text/plain',
    });
    let parserRouteToFile = new File([parserRoute], 'parser_file', {
      lastModified: new Date(),
      type: 'text/plain',
    });
    const formData = new FormData();
    formData.append('json_output_file', parserRouteToFile, 'feature_list.json');
    await dispatch({
      type: 'config/getCheckHealthScore',
      payload: formData,
    });
    // return '';
  };
  return (
    <div className={`card`}>
      {isUploadPage && (
        <div className={style.title}>
          New customer {externalCustomerId} is uploaded with {totalConfig.length} features
          {/* <a onClick={() => handleShowChart()}> {startCase(data?.[0]?.cust_id)}</a> */}
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

      <button className={style.checkHealthBtn} onClick={handleCheckHealthScore}>
        Check Health Score
      </button>
      {/* <Modal
        title={`Unparsed Configuration: ${externalCustomerId}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className={style.modal}
        bodyStyle={{ maxHeight: '500px', overflowY: 'scroll' }}
      >
        <div dangerouslySetInnerHTML={{ __html: renderContent(dataUniq?.[0]?.dataFile) }} />
      </Modal> */}
      <p style={{ overflowWrap: 'break-word' }}>{JSON.stringify(routeCmd)}</p>
      <div className="App">
        <table>
          <tr>
            <th>run_id</th>
            <th>status</th>
            <th>result_log</th>
            <th>health_score</th>
          </tr>
          {data_table.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.run_id}</td>
                <td>{val.status}</td>
                <td>{val.result_log}</td>
                <td>{val.health_score}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

// export default SummaryInfo;

export default connect(({ config: { internalCustomerId } }) => ({
  internalCustomerId,
}))(AutomationWorkflow);
