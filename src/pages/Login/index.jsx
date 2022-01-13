import { Button, Form, Input, notification } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

function Login(props) {
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;

  useEffect(() => {
    if (status === 'error' && !submitting) {
      notification.error({ message: 'Incorrect account or password' });
    }
  }, [status, submitting]);

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: values,
    });
  };

  return (
    <>
      <div className={styles.login}>
        <div className="heading-2" style={{ lineHeight: '40px' }}>
          Login to System Inventory Manager
        </div>
        <div className="heading-3" style={{ fontWeight: '400', marginTop: '24px' }}>
          Manage testbeds and servers
        </div>
        <Form
          name="normal_login"
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Cisco ID!' }]}
          >
            <Input
              className={styles.loginForm__input}
              placeholder="Cisco ID"
              autoComplete="off"
              autoFocus
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              className={styles.loginForm__input}
              type="password"
              placeholder="Password"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={submitting}
              className={styles.loginBtn}
              type="primary"
              htmlType="submit"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
