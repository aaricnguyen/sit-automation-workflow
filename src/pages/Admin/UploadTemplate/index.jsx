import PageLoading from '@/components/PageLoading';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const { Dragger } = Upload;

const UploadTemplate = ({ dispatch }) => {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
    await dispatch({
      type: 'config/uploadTemplate',
      payload: formData,
    });
    return '';
  };

  useEffect(() => {}, []);

  return (
    <PageContainer>
      <div className={`card`}>
        <Row justify="center" align="middle">
          <div>
            <Dragger
              showUploadList={false}
              accept=".json"
              action={(file) => handleUpload(file, 'file')}
              name="file"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p style={{ padding: '20px' }} className="ant-upload-hint">
                support .json file for uploading a configuration file
              </p>
            </Dragger>
          </div>
        </Row>
      </div>
    </PageContainer>
  );
};

export default connect(({}) => ({}))(UploadTemplate);
