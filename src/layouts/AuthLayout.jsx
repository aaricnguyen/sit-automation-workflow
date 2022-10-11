import { getToken } from '@/utils/token';
import { Col, Row } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import React from 'react';
import { connect, history } from 'umi';
import LoginImg from '../assets/login.png';
import Logo from '../assets/logo.svg';
import styles from './AuthLayout.less';

const AuthLayout = ({ children }) => {
  const token = getToken();
  if (token) {
    history.replace('/dashboard');
  }
  return (
    <>
      <Layout className={styles.auth}>
        {/* <Content>
          <Row>
            <Col lg={13} className={styles.contentLeft}>
              <div className={styles.contentLeft__image}>
                <img src={LoginImg} alt="auth image" />
                <div className={styles.contentLeft__image__mask} />
              </div>
              <div className={styles.contentLeft__logo}>
                <img src={Logo} alt="logo" />
                <div className={styles.contentLeft__logo__text}>Pro-Active Deployment Health Checker</div>
              </div>
              <div className={styles.contentLeft__text}>
                <div className="heading-1">Tomorrow Starts Here!</div>
                <div className="paragraph-2">
                  We create solutions built on intelligent networks that solve our customer’s
                  challenges.
                </div>
              </div>
            </Col>
            <Col lg={11} sm={24} className={styles.contentRight}>
              {children}
            </Col>
          </Row>
        </Content> */}
        {children}
      </Layout>
    </>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AuthLayout);
