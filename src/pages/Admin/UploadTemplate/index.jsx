import PageLoading from '@/components/PageLoading';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Upload } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { Dragger } = Upload;

const UploadTemplate = ({ dispatch, dataInsight, statusUpload }) => {
  const [insight, setInsight] = useState(dataInsight);
  const [disable, setDisable] = useState(statusUpload);
  const insightListRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = async () => {
    await dispatch({
      type: 'config/updatedTemplate',
    });

    setIsModalVisible(false);
    return '';
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await dispatch({
      type: 'config/uploadTemplate',
      payload: formData,
    });

    setIsModalVisible(true);
    return '';
  };

  useEffect(() => {
    console.log('set new data');
    setInsight(dataInsight);
    setDisable(statusUpload);
  }, [dataInsight]);

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

      <Modal
        title={`Preview template insight`}
        visible={isModalVisible}
        onOk={handleOk}
        okButtonProps={{ disabled: disable }}
        okText="Confirm Update"
        onCancel={handleCancel}
        className={styles.modal}
        bodyStyle={{ maxHeight: '500px', overflowY: 'scroll' }}
        width={800}
      >
        {}
        <div className={`card ${styles.insightList}`}>
          <div className={styles.insightList__header}>Insight List</div>
          <div ref={insightListRef} className={styles.insightList__container}>
            <pre>{insight}</pre>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ config: { dataInsight = [], statusUpload } }) => ({
  dataInsight,
  statusUpload,
}))(React.memo(UploadTemplate));
