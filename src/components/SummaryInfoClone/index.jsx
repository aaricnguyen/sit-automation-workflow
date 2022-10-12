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

let resHealthScoreList = [];
let resHealthScore = { s_no: '', status: '', run_id: '', health_score: null, result_log: null };

const AutomationWorkflow = (props) => {
  const {
    totalConfig,
    externalCustomerId,
    runIDList,
    dataCombine,
    isUploadPage = false,
    showChart,
    dataUniq,
    setShowChart = () => {},
    internalCustomerId,
    dispatch,
    setRunIDList,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [role, setRole] = useState(false);
  const [routeCmd, setRouteCmd] = useState({});
  const [dataTable, setDataTable] = useState([]);

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
    let res;
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
    res = await dispatch({
      type: 'config/getCheckHealthScore',
      payload: formData,
    });

    let runID = Object.keys(res.data)[0];
    if (!runIDList?.includes(runID)) {
      setRunIDList([...runIDList, runID]);
    }

    resHealthScore = res.data[runID];

    resHealthScoreList.push(resHealthScore);

    setDataTable([...dataTable, resHealthScore]);

    console.log('data table: ', dataTable);
    // setDataTable([resHealthScore]);

    // return ();
  };

  return (
    <div>
      <div className={`card`}>
        {isUploadPage && (
          <div className={style.title}>
            New customer {externalCustomerId} is uploaded with {totalConfig.length} features
            {/* <a onClick={() => handleShowChart()}> {startCase(data?.[0]?.cust_id)}</a> */}
          </div>
        )}
        {!isUploadPage && (
          <div className={style.title}>
            Customer {externalCustomerId} has {totalConfig.length} features enabled which are
            covered {data?.[0]?.value}% by{' '}
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

        {/* <p style={{ overflowWrap: 'break-word' }}>{JSON.stringify(routeCmd)}</p> */}
      </div>

      {/* <div className={`card`}>
        <div className={style.runTable}>
          <table id={style.runStatus}>
            <tr>
              <th>run_id</th>
              <th>status</th>
              <th>result_log</th>
              <th>health_score</th>
            </tr>
            {dataTable.map((val, key) => {
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
      </div> */}
    </div>
  );
};

// export default SummaryInfo;

export default connect()(AutomationWorkflow);
