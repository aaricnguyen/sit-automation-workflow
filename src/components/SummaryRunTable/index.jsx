import { Modal } from 'antd';
import { startCase } from 'lodash-es';
import React, { useState } from 'react';
import { connect } from 'umi';
import style from './index.less';

import { getAuthority } from '@/utils/authority';
import { useEffect } from 'react';

// let resHealthScoreList = [];
// let resHealthScore = { s_no: '', status: '', run_id: '', health_score: null, result_log: null };

const timeOut = 30000;
const AutomationWorkflow = (props) => {
  const { runIDList, isUploadPage = false, dispatch, setIsDisabled = () => {} } = props;
  const [role, setRole] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  // let resHealthScoreList = [];
  // let resHealthScore = { s_no: '', status: '', run_id: '', health_score: null, result_log: null };

  //useEffect
  useEffect(() => {
    console.log('effect', runIDList);
    if (runIDList?.length > 0) {
      handleCheckRunStatus(runIDList);
      let timeInterval = setInterval(() => {
        handleCheckRunStatus(runIDList);
      }, timeOut);
      return () => {
        clearInterval(timeInterval);
      };
    }
  }, [runIDList]);

  console.log('runIDList', runIDList);

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

  const handleCheckRunStatus = async (listID) => {
    console.log('run api', listID);
    const healthScorePromise = listID.map(async (runID) => {
      return await dispatch({
        type: 'config/checkRunStatus',
        id: runID,
      });
    });
    const resHealthScore = await Promise.all(healthScorePromise);
    let listData = [];
    listID.forEach((ele) => {
      resHealthScore.forEach((item) => {
        if (item !== undefined && item.data[ele] !== undefined) {
          listData.push(item.data[ele]);
        }
      });
    });
    setDataTable(listData);
  };

  return (
    <div className={`card`}>
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
    </div>
  );
};

// export default SummaryInfo;

export default connect((props) => props)(AutomationWorkflow);
