import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'umi';
import style from './index.less';

// let resHealthScoreList = [];
// let resHealthScore = { s_no: '', status: '', run_id: '', health_score: null, result_log: null };

const timeout = 30000;
const columnsAutomationStatus = [
  {
    title: 'Run ID',
    dataIndex: 'run_id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Result Log',
    dataIndex: 'result_log',
  },
  {
    title: 'Health Score',
    dataIndex: 'health_score',
  },
];
const SummaryRunTable = (props) => {
  const { runIDList = [], isUploadPage = false, dispatch } = props;
  const [role, setRole] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  // let resHealthScoreList = [];
  // let resHealthScore = { s_no: '', status: '', run_id: '', health_score: null, result_log: null };

  useEffect(() => {
    console.log('effect', runIDList);
    if (runIDList?.length > 0) {
      handleCheckRunStatus(runIDList);
      let timeInterval = setInterval(() => {
        handleCheckRunStatus(runIDList);
      }, timeout);
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
    try {
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
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  };

  const onRefresh = () => {
    if (runIDList.length > 0) {
      handleCheckRunStatus(runIDList);
    }
  };

  return (
    <div className={`card`}>
      <div className={style.cardTitle}>
        <h2>Automation Workflow Status</h2>
        <button className={style.refreshBtn} onClick={onRefresh}>
          Refresh
        </button>
      </div>
      {/* <div className={style.runTable}>
        <table id={style.runStatus}>
          <tr>
            <th>Run ID</th>
            <th>Status</th>
            <th>Result Log</th>
            <th>Health Score</th>
          </tr>
          {dataTable.map((val) => {
            const { run_id, status, result_log, health_score } = val;
            return (
              <tr key={run_id}>
                <td>{run_id}</td>
                <td>{status}</td>
                <td>{result_log}</td>
                <td>{health_score}</td>
              </tr>
            );
          })}
        </table>
      </div> */}
      <Table columns={columnsAutomationStatus} dataSource={dataTable} size="middle" />
    </div>
  );
};

// export default SummaryInfo;

export default connect((props) => props)(SummaryRunTable);
