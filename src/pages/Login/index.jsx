import { Button, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import Logo from '../../assets/logo.svg';
import styles from './index.less';

const initialValues = {
  username: '',
  password: '',
};
function Login(props) {
  /* Props */
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;
  /* State */
  const [passwordShown, setPasswordShown] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (status === 'error' && !submitting) {
      notification.error({ message: 'Incorrect account or password' });
    }
  }, [status, submitting]);

  useEffect(() => {
    // if (values.username.length > 0 && values.password.length > 0) {
    if (values.username.length > 0) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [values]);

  // const handleSubmit = (values) => {
  //   const { dispatch } = props;
  //   dispatch({
  //     type: 'login/login',
  //     payload: values,
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = props;
    dispatch({
      type: 'login/loginLocalNoPass',
      payload: values,
    });
  };

  const togglePassword = () => {
    setPasswordShown((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* <div className={styles.login}>
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
      </div> */}
      <div style={{ width: '100%', height: '100%' }}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginBox}>
            <h1>
              <img src={Logo} alt="CISCO LOGO" />
            </h1>
            <h2 className={styles.brandTitle}>
              <span className={styles.brandSub}>Deployment Insights</span>
            </h2>
            <p className={styles.brandDescription}>The bridge to possible</p>
            <form method="POST" className={styles.formWrapper} onSubmit={handleSubmit}>
              <div className={styles.dnxShadow}>
                <div className={styles.dnxInputField}>
                  <input
                    className={styles.formControl}
                    placeholder=" "
                    id="username"
                    name="username"
                    type="text"
                    onChange={handleChange}
                  />
                  <label className={styles.controlLabel}>Username</label>
                </div>
              </div>
              {/* <div className={styles.dnxShadow}>
                <div className={styles.dnxInputField}>
                  <input
                    className={styles.formControl}
                    placeholder=" "
                    id="password"
                    name="password"
                    type={passwordShown ? 'text' : 'password'}
                    onChange={handleChange}
                  />
                  <label className={styles.controlLabel}>Password</label>
                </div>
                {values.password.length > 0 && (
                  <span className={styles.showHide} onClick={togglePassword}>
                    {passwordShown ? 'HIDE' : 'SHOW'}
                  </span>
                )}
              </div> */}
              <Button
                type="primary"
                htmlType="submit"
                className={styles.loginBtn}
                disabled={isDisable}
                onClick={handleSubmit}
              >
                Log In
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default connect(({ login, loginLocalNoPass, loading }) => ({
  userLogin: loginLocalNoPass,
  submitting: loading.effects['login/loginLocalNoPass'],
  // userLogin: login,
  // submitting: loading.effects['login/login'],
}))(Login);
