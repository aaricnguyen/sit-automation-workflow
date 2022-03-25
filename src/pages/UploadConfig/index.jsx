import PageLoading from '@/components/PageLoading';
import SummaryInfo from '@/components/SummaryInfo';
import UploadChartContainer from '@/components/UploadChartContainer';
import UploadScaleChartContainer from '@/components/UploadScaleChartContainer';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Select, Upload } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const { Dragger } = Upload;

const UploadConfig = ({
  dispatch,
  loadingUploadConfig,
  externalCustomerId,
  totalConfig,
  dataCombine,
  internalCustomerList,
  loadingGetInternalCustomerList,
  matchPercent,
  dataUniq,
}) => {
  const [custSegment, setCustSegment] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const handleUpload = async (file) => {
    setShowChart(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('custSegment', custSegment);
    await dispatch({
      type: 'config/uploadConfig',
      payload: formData,
    });
    return '';
  };

  useEffect(() => {
    dispatch({
      type: 'config/getInternalCustomerList',
    });

    return async () => {
      await dispatch({
        type: 'config/save',
        payload: {
          externalCustomerId: null,
          chartData: [],
        },
      });
    };
  }, []);

  return (
    <PageContainer>
      <div className={`card`}>
        <Row justify="center" align="middle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontWeight: '600' }}>Customer type:</div>
              <div>
                {loadingGetInternalCustomerList ? (
                  <PageLoading />
                ) : (
                  <Select
                    defaultValue={custSegment}
                    style={{ width: '150px', margin: '25px 30px 25px 0' }}
                    onChange={(value) => setCustSegment(value)}
                  >
                    {internalCustomerList.map((item) => (
                      <Select.Option value={item.cust_segment} key={item.cust_segment}>
                        {startCase(item.cust_id)}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </div>
            </div>
            <Dragger
              showUploadList={false}
              accept=".cfg,.zip"
              action={(file) => handleUpload(file, 'file')}
              name="file"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p style={{ padding: '20px' }} className="ant-upload-hint">
                support .cfg file for uploading a configuration file and .zip file for uploading
                multiple configuration files at a time
              </p>
            </Dragger>
          </div>
        </Row>
      </div>
      {loadingUploadConfig && <PageLoading />}
      {!loadingUploadConfig && externalCustomerId && (
        <>
          <div style={{ marginTop: '20px' }}>
            <SummaryInfo
              externalCustomerId={externalCustomerId}
              dataCombine={dataCombine}
              matchPercent={matchPercent}
              totalConfig={totalConfig}
              isUploadPage={true}
              dataUniq={dataUniq}
              setShowChart={setShowChart}
              showChart={showChart}
            />
          </div>
          {showChart && (
            <div style={{ marginTop: '20px' }}>
              <UploadChartContainer isUploadPage={true} />
              <UploadScaleChartContainer isUploadPage={true} />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default connect(
  ({
    loading,
    config: {
      internalCustomerList = [],
      externalCustomerId = '',
      chartData = [],
      totalConfig = [],
      dataCombine = {},
      matchPercent = {},
      dataUniq = [],
    },
  }) => ({
    loadingUploadConfig: loading.effects['config/uploadConfig'],
    loadingGetInternalCustomerList: loading.effects['config/getInternalCustomerList'],
    externalCustomerId,
    chartData,
    totalConfig,
    dataCombine,
    internalCustomerList,
    matchPercent,
    dataUniq,
  }),
)(UploadConfig);
