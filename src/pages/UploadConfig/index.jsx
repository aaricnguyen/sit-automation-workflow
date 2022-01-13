import PageLoading from '@/components/PageLoading';
import SummaryInfo from '@/components/SummaryInfo';
import UploadChartContainer from '@/components/UploadChartContainer';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Upload } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';

const { Dragger } = Upload;

const UploadConfig = ({ dispatch, loading, externalCustomerId, totalConfig, dataCombine }) => {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await dispatch({
      type: 'config/uploadConfig',
      payload: formData,
    });
    return '';
  };

  useEffect(() => {
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
        </Row>
      </div>
      {loading && <PageLoading />}
      {!loading && externalCustomerId && (
        <>
          <div style={{ marginTop: '20px' }}>
            <SummaryInfo
              externalCustomerId={externalCustomerId}
              dataCombine={dataCombine}
              totalConfig={totalConfig}
              isUploadPage={true}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <UploadChartContainer isUploadPage={true} />
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default connect(
  ({
    loading,
    config: { externalCustomerId = '', chartData = [], totalConfig = [], dataCombine = {} },
  }) => ({
    loading: loading.effects['config/uploadConfig'],
    externalCustomerId,
    chartData,
    totalConfig,
    dataCombine,
  }),
)(UploadConfig);
